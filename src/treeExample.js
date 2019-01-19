const anne = { name: "anne" };
const anis = { name: "anis" };
const camille = { name: "camille" };
const paris = { name: "paris", children: [] };
paris["children"].push(anne);
paris["children"].push(anis);
const toulouse = { name: "toulouse", children: [] };
toulouse["children"].push(camille);
const country = { name: "france", children: [] };
country["children"].push(toulouse);
country["children"].push(paris);

function printChildren(node) {
  if (node.children === undefined) {
    console.log("this node has no children");
  }
  for (const child of node.children) {
    console.log(child.name);
  }
}

function printDescendants(prefix, node) {
  console.log(prefix + node.name);
  if (node.children !== undefined) {
    for (const child of node.children) {
      printDescendants(prefix + "-", child);
    }
  }
}

printDescendants("", country);
