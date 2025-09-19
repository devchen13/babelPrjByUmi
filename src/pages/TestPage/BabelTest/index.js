// import { packages, transform, transformFromAst } from "@babel/standalone";
import { packages, transform, transformFromAst } from "./babel";

export default () => {
  const { parser, traverse, generator } = packages;
  const babelParser = parser;
  const babel = {
    transformFromAst,
    transform,
    traverse: traverse.default,
    generate: generator.default,
    parse: babelParser.parse,
  };

  const baseStr = "var a = 'test-a';";

  const arrowFun = `const vv=()=>{
    const aa=1;
    return aa
}`;

  const classSimple = `class Example {}`;

  const codeStr = arrowFun;
  // 方法1

  const ast = babel.parse(codeStr);
  console.log("parser------ast", ast);

  babel.traverse(ast, {
    enter(path) {
      // 变量名
      if (path.isIdentifier({ name: "aa" })) {
        path.node.name = "bb";
      }
      // 关键字
      if (path.node.kind === "const") {
        path.node.kind = "var";
      }
    },
  });

  console.log("parser------customAst", ast);

  const output = babel.generate(
    ast,
    {
      /* options */
      // comments: 是否保留注释。
      // compact: 是否生成紧凑的代码，去除不必要的空格和换行。
      // minified: 是否生成最小化的代码。
      // sourceMaps: 是否生成 Source Map。
    }
    // code
  );

  console.log("产出---", output);

  // 方法2

  let result = babel.transform(codeStr, {
    // presets: ['es2015'],
    plugins: ["transform-arrow-functions", "transform-classes"],
  });
  console.log("转换前：", result);

  const transAst = (ast) => {
    let newAst = JSON.parse(JSON.stringify(ast));
    let body = newAst.program.body;
    let nodeLen = newAst.program.body.length;

    // 对应节点进行转换
    function transNode(node) {
      let nodeType = node.type;
      let transMethods = {
        VariableDeclaration: () => {
          node.kind = "const";
        },
        VariableDeclarator: () => {
          node.id.name = "bbb";
          node.init.value = "test-b";
        },
      };

      if (node.declarations) {
        transNode(node.declarations[0]);
      }

      if (transMethods[nodeType]) {
        transMethods[nodeType]();
      }
    }

    if (nodeLen > 0) {
      for (let nodeIdx = 0; nodeIdx < nodeLen; nodeIdx++) {
        transNode(body[nodeIdx]);
      }
    }

    return newAst;
  };
  console.log("ast:", result);
  // console.log("ast---------:", babel.transformFromAst(result.ast));

  // 将新的ast转换成代码
  let code = babel.transformFromAst(
    transAst(babel.parse(result.code)),
    "",

    {
      plugins: ["transform-arrow-functions", "transform-classes"],
    }
  ).code;

  console.log(codeStr, "转换后：" + code);

  return codeStr + "转换后：" + code;
};
