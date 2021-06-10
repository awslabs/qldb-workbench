import ace from "ace-builds/src-noconflict/ace";

export class PartiQLHighlightRules extends ace.acequire(
  "ace/mode/text_highlight_rules"
).TextHighlightRules {
  constructor() {
    super();
    var keywords =
      "action|alter|and|any|are|as|asc|assertion|at|authorization|bag|begin|" +
      "between|bit_length|both|by|cascade|cascaded|case|cast|catalog|" +
      "character_length|char_length|check|clob|close|collate|collation|column|commit|connect|" +
      "connection|constraint|constraints|continue|convert|corresponding|create|cross|current|current_date|" +
      "current_time|current_timestamp|current_user|cursor|date_add|date_diff|day|deallocate|dec|" +
      "declare|default|deferrable|deferred|delete|desc|describe|descriptor|diagnostics|disconnect|distinct|" +
      "domain|drop|else|end|end-exec|escape|except|exception|exec|execute|exists|external|extract|" +
      "fetch|for|foreign|found|from|full|get|global|go|goto|grant|group|having|hour|identity|" +
      "immediate|in|index|indicator|initially|inner|input|insensitive|insert|intersect|interval|" +
      "into|is|isolation|join|key|language|leading|left|level|like|limit|list|local|lower|match|" +
      "minute|missing|module|month|names|national|natural|nchar|next|no|not|null|nullif|octet_length|" +
      "of|on|only|open|option|or|order|outer|output|overlaps|pad|partial|pivot|position|precision|prepare|" +
      "preserve|primary|prior|privileges|procedure|public|read|references|relative|remove|restrict|revoke|" +
      "right|rollback|rows|schema|scroll|second|section|select|session|session_user|sexp|size|smallint|some|" +
      "space|sql|sqlcode|sqlerror|sqlstate|string|struct|substring|symbol|system_user|table|temporary|then|" +
      "time|timezone_hour|timezone_minute|to|to_string|to_timestamp|trailing|transaction|translate|" +
      "translation|trim|tuple|txid|undrop|union|unique|unknown|unpivot|update|upper|usage|user|using|" +
      "utcnow|value|values|varying|view|when|whenever|where|with|work|write|year|zone|history";

    var builtinConstants = "true|false";

    var builtinFunctions =
      "avg|count|first|last|max|min|sum|" +
      "coalesce|ifnull|isnull|nvl|absolute|add|all|allocate";

    var dataTypes =
      "int|numeric|decimal|date|varchar|char|float|double|bit|set|timestamp|" +
      "real|blob|bool|boolean|integer|character";

    var keywordMapper = this.createKeywordMapper(
      {
        "support.function": builtinFunctions,
        keyword: keywords,
        "constant.language": builtinConstants,
        "storage.type": dataTypes,
      },
      "identifier",
      true
    );

    this.$rules = {
      start: [
        {
          token: "comment",
          regex: "--.*$",
        },
        {
          token: "comment",
          start: "/\\*",
          end: "\\*/",
        },
        {
          token: "string", // " string
          regex: '".*?"',
        },
        {
          token: "string", // ' string
          regex: "'.*?'",
        },
        {
          token: "string", // ` string (apache drill)
          regex: "`.*?`",
        },
        {
          token: "constant.numeric", // float
          regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b",
        },
        {
          token: keywordMapper,
          regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b",
        },
        {
          token: "keyword.operator",
          regex: "\\+|\\-|\\/|\\/\\/|%|<@>|@>|<@|&|\\^|~|<|>|<=|=>|==|!=|<>|=",
        },
        {
          token: "paren.lparen",
          regex: "[\\(]",
        },
        {
          token: "paren.rparen",
          regex: "[\\)]",
        },
        {
          token: "text",
          regex: "\\s+",
        },
        {
          token: "",
          start: "<<",
          end: ">>",
        },
      ],
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

export type Snippets = { name: string; snippet: string };

export const defaultSnippets: Snippets[] = [
  {
    name: "s*",
    snippet: "select * from ${1:table}\n",
  },
  {
    name: "tbl",
    snippet: "create table ${1:table}\n",
  },
  {
    name: "ins",
    snippet:
      "insert into ${1:table}\n" +
      "   <<\n" +
      "       {${2:data}}\n" +
      "   >>\n",
  },
  {
    name: "sby*",
    snippet: "select * from ${1:table} by ${2:r_id}\n",
  },
  {
    name: "cin",
    snippet: "create index on ${1:table} (${2:field})\n",
  },
];
