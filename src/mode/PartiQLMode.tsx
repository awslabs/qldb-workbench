import ace from "ace-builds/src-noconflict/ace";

export class PartiQLHighlightRules extends ace.acequire(
    "ace/mode/text_highlight_rules"
).TextHighlightRules {
    constructor() {
        super();
        var keywords = (
            "select|insert|update|delete|from|where|and|or|group|by|order|limit|offset|having|as|case|" +
            "when|then|else|end|type|left|right|join|on|outer|desc|asc|union|create|table|primary|key|if|" +
            "foreign|not|references|default|null|inner|cross|natural|database|drop|grant|history"
        );

        var builtinConstants = (
            "true|false"
        );

        var builtinFunctions = (
            "avg|count|first|last|max|min|sum|ucase|lcase|mid|len|round|rank|now|format|" +
            "coalesce|ifnull|isnull|nvl"
        );

        var dataTypes = (
            "int|numeric|decimal|date|varchar|char|bigint|float|double|bit|binary|text|set|timestamp|" +
            "money|real|number|integer"
        );

        var keywordMapper = this.createKeywordMapper({
            "support.function": builtinFunctions,
            "keyword": keywords,
            "constant.language": builtinConstants,
            "storage.type": dataTypes
        }, "identifier", true);

        this.$rules = {
            "start" : [ {
                token : "comment",
                regex : "--.*$"
            },  {
                token : "comment",
                start : "/\\*",
                end : "\\*/"
            }, {
                token : "string",           // " string
                regex : '".*?"'
            }, {
                token : "string",           // ' string
                regex : "'.*?'"
            }, {
                token : "string",           // ` string (apache drill)
                regex : "`.*?`"
            }, {
                token : "constant.numeric", // float
                regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
            }, {
                token : keywordMapper,
                regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
            }, {
                token : "keyword.operator",
                regex : "\\+|\\-|\\/|\\/\\/|%|<@>|@>|<@|&|\\^|~|<|>|<=|=>|==|!=|<>|="
            }, {
                token : "paren.lparen",
                regex : "[\\(]"
            }, {
                token : "paren.rparen",
                regex : "[\\)]"
            }, {
                token : "text",
                regex : "\\s+"
            } ]
        };
        this.normalizeRules();
    }
}

export default class PartiQLMode extends ace.acequire("ace/mode/text").Mode {
    constructor() {
        super();
        this.HighlightRules = PartiQLHighlightRules;
    }
}