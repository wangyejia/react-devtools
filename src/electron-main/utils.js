/*jshint -W030 */
var tagRE = /<[a-zA-Z\-\!\/](?:"[^"]*"['"]*|'[^']*'['"]*|[^'"])*?(?<!=)>/g;
var attrRE = /[^)]\s([^'"/\s><{}:,0-9]+?)[\s/>]|([^\s=]+)=\s?(".*?"|'.*?'|{{.*?}}|([\s\S]*?)}+)/g;
// re-used obj for quick lookups of components
var empty = Object.create ? Object.create(null) : {};
// create optimized lookup object for
// void elements as listed here:
// http://www.w3.org/html/wg/drafts/html/master/syntax.html#void-elements
var lookup = Object.create ? Object.create(null) : {};
lookup.area = true;
lookup.base = true;
lookup.br = true;
lookup.col = true;
lookup.embed = true;
lookup.hr = true;
lookup.img = true;
lookup.input = true;
lookup.keygen = true;
lookup.link = true;
lookup.menuitem = true;
lookup.meta = true;
lookup.param = true;
lookup.source = true;
lookup.track = true;
lookup.wbr = true;

const tagName2DisplayType = {
    div: 'block',
    Button: 'inline'
};

const getRandomId = () =>
    Math.random()
        .toString(36)
        .slice(-8)
        .toUpperCase();
function parseTag(tag) {
    var res = {
        type: 'tag',
        displayType: 'container',
        name: '',
        voidElement: false,
        attrs: {},
        children: []
    };

    var tagMatch = tag.match(/<\/?([^\s]+?)[/\s>]/);
    if (tagMatch) {
        const tagName = tagMatch[1];
        res.name = tagName;
        res.displayType = tagName2DisplayType[tagName];
        if (
            lookup[tagName.toLowerCase()] ||
            tag.charAt(tag.length - 2) === '/'
        ) {
            res.voidElement = true;
        }
    }

    var reg = new RegExp(attrRE);
    var result = null;
    for (;;) {
        result = reg.exec(tag);

        if (result === null) {
            break;
        }

        if (!result[0].trim()) {
            continue;
        }

        if (result[1]) {
            var attr = result[1].trim();
            var arr = [attr, ''];

            if (attr.indexOf('=') > -1) {
                arr = attr.split('=');
            }

            res.attrs[arr[0]] = arr[1];
            reg.lastIndex--;
        } else if (result[2]) {
            const value = /{{.*?}}/g.test(result[3])
                ? result[3]
                      .trim()
                      .substring(2, result[3].length - 2)
                      .trim()
                      .split(',')
                      .reduce((obj, item) => {
                          const [itemKey, itemVal] = item
                              .split(':')
                              .map(item => {
                                  const tmp = item.trim();
                                  return tmp[0] === '"' || tmp[0] === "'"
                                      ? tmp.substring(1, tmp.length - 1)
                                      : Number(tmp) || tmp;
                              });
                          obj[itemKey] = itemVal;
                          return obj;
                      }, {})
                : result[3].trim().substring(1, result[3].length - 1);
            res.attrs[result[2]] = value;
        }
    }
    res.attrs.id = getRandomId();
    return res;
}

function parse(html, options) {
    debugger;
    options || (options = {});
    options.components || (options.components = empty);
    var result = [];
    var current;
    var level = -1;
    var arr = [];
    var byTag = {};
    var inComponent = false;

    html.replace(tagRE, function(tag, index) {
        if (inComponent) {
            if (tag !== '</' + current.name + '>') {
                return;
            } else {
                inComponent = false;
            }
        }
        var isOpen = tag.charAt(1) !== '/';
        var start = index + tag.length;
        var nextChar = html.charAt(start);
        var parent;

        if (isOpen) {
            level++;

            current = parseTag(tag);
            if (current.type === 'tag' && options.components[current.name]) {
                current.type = 'component';
                inComponent = true;
            }

            if (
                !current.voidElement &&
                !inComponent &&
                nextChar &&
                nextChar !== '<' &&
                !/^\s*$/.test(html.slice(start, html.indexOf('<', start)))
            ) {
                current.children.push({
                    type: 'text',
                    content: html.slice(start, html.indexOf('<', start)).trim(),
                    attrs: { id: getRandomId() }
                });
            }

            byTag[current.tagName] = current;

            // if we're at root, push new base node
            if (level === 0) {
                result.push(current);
            }

            parent = arr[level - 1];

            if (parent) {
                parent.children.push(current);
            }

            arr[level] = current;
        }

        if (!isOpen || current.voidElement) {
            level--;
            if (!inComponent && nextChar !== '<' && nextChar) {
                // trailing text node
                // if we're at the root, push a base text node. otherwise add as
                // a child to the current node.
                parent = level === -1 ? result : arr[level].children;

                // calculate correct end of the content slice in case there's
                // no tag after the text node.
                var end = html.indexOf('<', start);
                var content = html.slice(start, end === -1 ? undefined : end);
                // if a node is nothing but whitespace, no need to add it.
                if (!/^\s*$/.test(content)) {
                    parent.push({
                        type: 'text',
                        content: content,
                        attrs: { id: getRandomId() }
                    });
                }
            }
        }
    });
    return result;
}

function attrString(attrs) {
    var buff = [];
    for (var key in attrs) {
        if (key === 'style') {
            const value = JSON.stringify(attrs[key]);
            buff.push(key + '={' + value + '}');
        } else if (/on[A-Z][a-z]*\b/.test(key)) {
            buff.push(key + '={' + attrs[key] + '}');
        } else {
            buff.push(key + '="' + attrs[key] + '"');
        }
    }
    if (!buff.length) {
        return '';
    }
    return ' ' + buff.join(' ');
}

function stringify(buff, doc) {
    switch (doc.type) {
        case 'text':
            return buff + doc.content;
        case 'tag':
            buff +=
                '<' +
                doc.name +
                (doc.attrs ? attrString(doc.attrs) : '') +
                (doc.voidElement ? '/>' : '>');
            if (doc.voidElement) {
                return buff;
            }
            return (
                buff +
                doc.children.reduce(stringify, '') +
                '</' +
                doc.name +
                '>'
            );
    }
}

module.exports = {
    parse,
    stringify: function(doc) {
        return doc.reduce(function(token, rootEl) {
            return token + stringify('', rootEl);
        }, '');
    }
};
