### 1. 基础介绍

1.   项目根目录下的 .prettierrc 配置文件会影响 VSCode 的 prettier 扩展，且优先级高于在 VSCode settings.json 中的 prettier 扩展配置。想必 eslint 也是同理
2.   项目 .vscode 文件下 settings.json 的优先级高于全局 settings.json



### 2. 配置文件

#### 2.1 vscode配置

-   settings.json: vscode 全局配置
-   .vscode/settings.json: 当前项目的配置

#### 2.2 插件配置

-   .prettierrc: prettier 配置
-   .eslintrc.js: eslint 配置

#### 2.3 优先级

.prettierrc / .eslintrc.js > .vscode/settings.json > settings.json



### 3. 插件/包作用

#### 3.1 插件

-   eslint: 根据配置格式化代码，coder 向
-   prettier: 根据配置格式化代码，coder 向

#### 3.2 包

-   eslint-loader: 配合构建工具在开发环境运行时以及生产构建时抛出错误或提示



### 4. 工具作用

#### 4.1 eslint

主要用于语法检查，但也接管了部分代码格式化配置（不做格式化）

#### 4.2 prettier

永远只做格式化

#### 4.3 冲突

两者的配置如果不统一，产生了冲突怎么处理？

Prettier 中的相关描述：

>   Linters usually contain not only code quality rules, but also stylistic rules. Most stylistic rules are unnecessary when using Prettier, but worse – they might conflict with Prettier! Use Prettier for code formatting concerns, and linters for code-quality concerns ...