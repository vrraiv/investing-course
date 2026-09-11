export function callouts() {
  return (tree) => {
    function visit(node) {
      if (node.type === 'blockquote') {
        const first = node.children?.[0]?.children?.[0];
        const match = first?.type === 'text' && first.value.match(/^\[!(CONCEPT|PM QUESTION|EXERCISE|DELIVERABLE|WARNING)\]\s*/);
        if (match) {
          first.value = first.value.slice(match[0].length);
          node.data = { hProperties: { className: ['callout', `callout-${match[1].toLowerCase().replace(' ', '-')}`], 'data-label': match[1] } };
        }
      }
      node.children?.forEach(visit);
    }
    visit(tree);
  };
}
