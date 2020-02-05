/*jshint -W030 */
const tagRE = /(<[a-zA-Z\-!/](?:"[^"]*"['"]*|'[^']*'['"]*|[^'"])*?(?<!=)>)|(?<=>[\s\S]*)({.*)|}\)}/g;
const attrRE = /[^)]\s([^'"/\s><{}:,0-9]+?)[\s/>]|([^\s=]+)=\s?(".*?"|'.*?'|{{.*?}}|([\s\S]*?)}+)/g;
// re-used obj for quick lookups of components
const empty = Object.create ? Object.create(null) : {};
// create optimized lookup object for
// void elements as listed here:
// http://www.w3.org/html/wg/drafts/html/master/syntax.html#void-elements
let lookup = Object.create ? Object.create(null) : {};
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
    let res = {
        type: 'tag',
        displayType: 'container',
        name: '',
        voidElement: false,
        attrs: {},
        children: []
    };

    let tagMatch = tag.match(/<\/?([^\s]+?)[/\s>]/);
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

    let reg = new RegExp(attrRE);
    let result = null;
    for (;;) {
        result = reg.exec(tag);

        if (result === null) {
            break;
        }

        if (!result[0].trim()) {
            continue;
        }

        if (result[1]) {
            let attr = result[1].trim();
            let arr = [attr, ''];

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
function parseFunc(tag) {
    let res = {
        type: 'func',
        displayType: 'container',
        target: '',
        name: '',
        voidElement: false,
        attrs: { id: getRandomId() },
        children: []
    };
    if (tag[tag.length - 1] === '}') {
        res.name = tag.slice(1, -1);
        res.voidElement = true;
        return res;
    }
    const nameReg = /(?<={).*(?=\(\()/g;
    const nameMatch = tag.match(nameReg);
    const paramReg = /(?<=\().*(?=\s=>)/g;
    const paramMatch = tag.match(paramReg);
    if (nameMatch) {
        [res.target, res.name] = nameMatch[0].split('.');
    }
    if (paramMatch) {
        let params = paramMatch[0];
        params = params[0] === '(' ? params.slice(1, -1) : params;
        res.params = params.split(', ');
    }
    return res;
}
function parseElement(
    html,
    compName,
    dependencies,
    variables,
    functions,
    options
) {
    // debugger;
    options || (options = {});
    options.components || (options.components = empty);
    let result = [];
    let current;
    let level = -1;
    let arr = [];
    let byTag = {};
    let inComponent = false;
    let component = {
        type: 'component',
        displayType: 'container',
        name: 'div',
        compName,
        dependencies,
        variables,
        functions,
        attrs: { id: getRandomId() },
        children: result
    };
    html.replace(tagRE, function(tag, ...rest) {
        if (inComponent) {
            if (tag !== '</' + current.name + '>') {
                return;
            } else {
                inComponent = false;
            }
        }
        let index = rest[2];
        let isOpen = tag.charAt(1) !== '/' && tag !== '})}';
        let start = index + tag.length;
        let nextChar = html.charAt(start);
        let parent;
        if (tag[0] === '{') {
            level++;
            current = parseFunc(tag);
            // if we're at root, push new base node
            if (level === 0) {
                result.push(current);
            }
            parent = arr[level - 1];
            if (parent) {
                parent.children.push(current);
            }
            arr[level] = current;
        } else if (isOpen) {
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
                !/^\s*$/.test(html.slice(start, html.indexOf('<', start))) &&
                html[start + 1] !== '{'
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
                let end = html.indexOf('<', start);
                let content = html.slice(start, end === -1 ? undefined : end);
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
    return [component];
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
    parseElement,
    stringify: function(doc) {
        return doc.reduce(function(token, rootEl) {
            return token + stringify('', rootEl);
        }, '');
    }
};
