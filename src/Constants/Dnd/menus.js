import { menuTypes, displayTypes } from './types';

export const menus = [
    {
        title: 'Antd 组件',
        type: menuTypes.SUB,
        icon: 'ant-design',
        key: 'antd',
        children: [
            {
                title: '通用',
                type: menuTypes.ITEMGROUP,
                key: 'antd-global',
                children: [
                    {
                        title: 'Button 按钮',
                        type: 'Button',
                        key: 'antd-global-button',
                        displayType: displayTypes.INLINE
                    },
                    {
                        title: 'Icon 图标',
                        type: 'Icon',
                        key: 'antd-global-icon',
                        displayType: displayTypes.INLINE
                    },
                    {
                        title: 'Typography 排版',
                        type: menuTypes.SUB,
                        key: 'antd-global-typography',
                        children: [
                            {
                                title: 'Typography 容器',
                                type: 'Typography',
                                key: 'antd-global-typography-typography',
                                displayType: displayTypes.CONTAINER
                            },
                            {
                                title: 'Text 文本',
                                type: 'Typography.Text',
                                key: 'antd-global-typography-text',
                                displayType: displayTypes.INLINE
                            },
                            {
                                title: 'Title 标题',
                                type: 'Typography.Title',
                                key: 'antd-global-typography-title',
                                displayType: displayTypes.INLINE
                            },
                            {
                                title: 'Paragraph 段落',
                                type: 'Typography.Paragraph',
                                key: 'antd-global-typography-paragraph',
                                displayType: displayTypes.BLOCK
                            }
                        ]
                    }
                ]
            },
            {
                title: '布局',
                type: menuTypes.ITEMGROUP,
                key: 'antd-layout',
                children: [
                    {
                        title: 'Grid 栅格',
                        type: menuTypes.SUB,
                        key: 'antd-layout-grid',
                        children: [
                            {
                                title: 'Row 行',
                                type: 'Row',
                                key: 'antd-layout-grid-row'
                            },
                            {
                                title: 'Col 列',
                                type: 'Col',
                                key: 'antd-layout-grid-col'
                            }
                        ]
                    },
                    {
                        title: 'Layout 布局',
                        type: menuTypes.SUB,
                        key: 'antd-layout-layout',
                        children: [
                            {
                                title: 'Layout 容器',
                                type: 'Layout',
                                key: 'antd-layout-layout-layout',
                                displayType: displayTypes.CONTAINER
                            },
                            {
                                title: 'Header 顶部',
                                type: 'Layout.Header',
                                key: 'antd-layout-layout-header',
                                displayType: displayTypes.BLOCK
                            },
                            {
                                title: 'Content 中部',
                                type: 'Layout.Content',
                                key: 'antd-layout-layout-content',
                                displayType: displayTypes.BLOCK
                            },
                            {
                                title: 'Footer 底部',
                                type: 'Layout.Footer',
                                key: 'antd-layout-layout-footer',
                                displayType: displayTypes.BLOCK
                            },
                            {
                                title: 'Sider 侧边',
                                type: 'Layout.Sider',
                                key: 'antd-layout-layout-sider'
                            }
                        ]
                    }
                ]
            },
            {
                title: '导航',
                type: menuTypes.ITEMGROUP,
                key: 'antd-nav',
                children: [
                    {
                        title: 'Affix 固钉',
                        type: 'Affix',
                        key: 'antd-nav-grid'
                    },
                    {
                        title: 'Breadcrumb 面包屑',
                        type: menuTypes.SUB,
                        key: 'antd-nav-breadcrumb',
                        children: [
                            {
                                title: 'Breadcrumb 容器',
                                type: 'Breadcrumb',
                                key: 'antd-nav-breadcrumb-breadcrumb'
                            },
                            {
                                title: 'Item 项',
                                type: 'Breadcrumb.Item',
                                key: 'antd-nav-breadcrumb-item'
                            },
                            {
                                title: 'Separator 分隔符',
                                type: 'Breadcrumb.Separator',
                                key: 'antd-nav-breadcrumb-separator'
                            }
                        ]
                    },
                    {
                        title: 'Dropdown 下拉菜单',
                        type: menuTypes.SUB,
                        key: 'antd-nav-dropdown',
                        children: [
                            {
                                title: 'Dropdown 容器',
                                type: 'Dropdown',
                                key: 'antd-nav-dropdown-dropdown'
                            },
                            {
                                title: 'Button 按钮',
                                type: 'Dropdown.Button',
                                key: 'antd-nav-dropdown-button'
                            }
                        ]
                    },
                    {
                        title: 'Menu 导航菜单',
                        type: menuTypes.SUB,
                        key: 'antd-nav-menu',
                        children: [
                            {
                                title: 'Menu 容器',
                                type: 'Menu',
                                key: 'antd-nav-menu-menu'
                            },
                            {
                                title: 'Item 项',
                                type: 'Menu.Item',
                                key: 'antd-nav-menu-item'
                            },
                            {
                                title: 'ItemGroup 分组',
                                type: 'Menu.ItemGroup',
                                key: 'antd-nav-menu-itemgroup'
                            },
                            {
                                title: 'SubMenu 子菜单',
                                type: 'Menu.Submenu',
                                key: 'antd-nav-menu-submenu'
                            },
                            {
                                title: 'Divider 分割线',
                                type: 'Menu.Divider',
                                key: 'antd-nav-menu-divider'
                            }
                        ]
                    },
                    {
                        title: 'Pagination 分页',
                        type: 'Pagination',
                        key: 'antd-nav-pagination'
                    },
                    {
                        title: 'PageHeader 页头',
                        type: 'PageHeader',
                        key: 'antd-nav-pageHeader'
                    },
                    {
                        title: 'Steps 步骤条',
                        type: menuTypes.SUB,
                        key: 'antd-nav-steps',
                        children: [
                            {
                                title: 'Steps 容器',
                                type: 'Steps',
                                key: 'antd-nav-steps-steps'
                            },
                            {
                                title: 'step 步骤',
                                type: 'Steps.Step',
                                key: 'antd-nav-steps-step'
                            }
                        ]
                    }
                ]
            },
            {
                title: '数据录入',
                type: menuTypes.ITEMGROUP,
                key: 'antd-input',
                children: [
                    {
                        title: 'Input 输入框',
                        type: menuTypes.SUB,
                        key: 'antd-input-input',
                        children: [
                            {
                                title: 'Input 基础输入框',
                                type: 'Input',
                                key: 'antd-input-input-input',
                                displayType: displayTypes.INLINE
                            },
                            {
                                title: 'TextArea 输入区',
                                type: 'Input.TextArea',
                                key: 'antd-input-input-textarea',
                                displayType: displayTypes.INLINE
                            },
                            {
                                title: 'Search 搜索框',
                                type: 'Input.Search',
                                key: 'antd-input-input-search',
                                displayType: displayTypes.INLINE
                            },
                            {
                                title: 'Group 输入框组',
                                type: 'Input.Group',
                                key: 'antd-input-input-group',
                                displayType: displayTypes.INLINE
                            },
                            {
                                title: 'Password 密码输入框',
                                type: 'Input.Password',
                                key: 'antd-input-input-password',
                                displayType: displayTypes.INLINE
                            }
                        ]
                    }
                ]
            },
            {
                title: '数据展示',
                type: menuTypes.ITEMGROUP,
                key: 'antd-data',
                children: [
                    {
                        title: 'Avatar 头像',
                        type: 'Avatar',
                        key: 'antd-data-avatar'
                    },
                    {
                        title: 'Badge 徽标数',
                        type: 'Badge',
                        key: 'antd-data-badge'
                    },
                    {
                        title: 'Comment 评论',
                        type: 'Comment',
                        key: 'antd-data-comment'
                    },
                    {
                        title: 'Collapse 折叠板',
                        type: menuTypes.SUB,
                        key: 'antd-data-collapse',
                        children: [
                            {
                                title: 'Collapse 容器',
                                type: 'Collapse',
                                key: 'antd-data-collapse-collapse'
                            },
                            {
                                title: 'Panel 面板',
                                type: 'Collapse.Panel',
                                key: 'antd-data-collapse-panel'
                            }
                        ]
                    },
                    {
                        title: 'Carousel 走马灯',
                        type: 'Carousel',
                        key: 'antd-data-carousel'
                    },
                    {
                        title: 'Card 卡片',
                        type: menuTypes.SUB,
                        key: 'antd-data-card',
                        children: [
                            {
                                title: 'Card 容器',
                                type: 'Card',
                                key: 'antd-data-card-card'
                            },
                            {
                                title: 'Grid 网格',
                                type: 'Card.Grid',
                                key: 'antd-data-card-grid'
                            },
                            {
                                title: 'Meta 配置',
                                type: 'Card.Meta',
                                key: 'antd-data-card-meta'
                            }
                        ]
                    },
                    {
                        title: 'Calendar 日历',
                        type: 'Calendar',
                        key: 'antd-data-calendar'
                    },
                    {
                        title: 'Descriptions 描述列表',
                        type: menuTypes.SUB,
                        key: 'antd-data-descriptions',
                        children: [
                            {
                                title: 'Descriptions 容器',
                                type: 'Descriptions',
                                key: 'antd-data-descriptions-descriptions'
                            },
                            {
                                title: 'Item 项',
                                type: 'Descriptions.Item',
                                key: 'antd-data-descriptions-item'
                            }
                        ]
                    },
                    {
                        title: 'Empty 空状态',
                        type: 'Empty',
                        key: 'antd-data-empty'
                    },
                    {
                        title: 'List 列表',
                        type: menuTypes.SUB,
                        key: 'antd-data-list',
                        children: [
                            {
                                title: 'List 容器',
                                type: 'List',
                                key: 'antd-data-list-list'
                            },
                            {
                                title: 'Item 项',
                                type: 'List.Item',
                                key: 'antd-data-list-item'
                            },
                            {
                                title: 'Meta 配置',
                                type: 'List.Item.Meta',
                                key: 'antd-data-list-item-meta'
                            }
                        ]
                    },
                    {
                        title: 'Popover 气泡卡片',
                        type: 'Popover',
                        key: 'antd-data-popover'
                    },
                    {
                        title: 'Statistic 统计数值',
                        type: menuTypes.SUB,
                        key: 'antd-data-statistic',
                        children: [
                            {
                                title: 'Statistic 容器',
                                type: 'Statistic',
                                key: 'antd-data-statistic-statistic'
                            },
                            {
                                title: 'Countdown 倒计时',
                                type: 'Statistic.Countdown',
                                key: 'antd-data-statistic-countdown'
                            }
                        ]
                    },
                    {
                        title: 'Tree 树形控件',
                        type: 'Tree',
                        key: 'antd-data-tree'
                    },
                    {
                        title: 'Tooltip 文字提示',
                        type: 'Tooltip',
                        key: 'antd-data-tooltip'
                    },
                    {
                        title: 'Timeline 时间轴',
                        type: menuTypes.SUB,
                        key: 'antd-data-timeline',
                        children: [
                            {
                                title: 'Timeline 容器',
                                type: 'Timeline',
                                key: 'antd-data-Timeline-Timeline'
                            },
                            {
                                title: 'Item 项',
                                type: 'Timeline.Item',
                                key: 'antd-data-timeline-item'
                            }
                        ]
                    },
                    {
                        title: 'Tag 标签',
                        type: menuTypes.SUB,
                        key: 'antd-data-tag',
                        children: [
                            {
                                title: 'Tag 标签',
                                type: 'Tag',
                                key: 'antd-data-tag-tag'
                            },
                            {
                                title: 'CheckableTag 可选标签',
                                type: 'Tag.CheckableTag',
                                key: 'antd-data-tag-checkabletag'
                            }
                        ]
                    },
                    {
                        title: 'Tabs 标签页',
                        type: menuTypes.SUB,
                        key: 'antd-data-tabs',
                        children: [
                            {
                                title: 'Tabs 容器',
                                type: 'Tabs',
                                key: 'antd-data-tabs-tabs'
                            },
                            {
                                title: 'TabPane 标签项',
                                type: 'Tabs.TabPane',
                                key: 'antd-data-tabs-tabpane'
                            }
                        ]
                    },
                    {
                        title: 'Table 表格',
                        type: 'Table',
                        key: 'antd-data-table'
                    }
                ]
            }
        ]
    },
    {
        title: '通用组件',
        type: menuTypes.SUB,
        icon: 'global',
        key: 'global',
        children: [
            {
                title: 'div',
                type: 'div',
                key: 'global-div'
            },
            {
                title: 'span',
                type: 'span',
                key: 'global-span'
            },
            {
                title: 'ul',
                type: 'ul',
                key: 'global-ul',
                displayType: displayTypes.BLOCK
            },
            {
                title: 'li',
                type: 'li',
                key: 'global-li',
                displayType: displayTypes.BLOCK
            },
            {
                title: 'function',
                type: 'func',
                key: 'global-func',
                displayType: displayTypes.BLOCK
            }
        ]
    }
];
