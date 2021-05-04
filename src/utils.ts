//needs actual DOM testing
export const utils = {
  getTextSelectionRects(range: Range) {
    const iterator = document.createNodeIterator(
      range.commonAncestorContainer,
      NodeFilter.SHOW_ALL, // pre-filter
      {
        // custom filter
        acceptNode: function(node) {
          return NodeFilter.FILTER_ACCEPT
        }
      }
    )

    const nodes = []
    while (iterator.nextNode()) {
      if (
        nodes.length === 0 &&
        iterator.referenceNode !== range.startContainer
      )
        continue
      if (iterator.referenceNode.nodeName !== '#text') continue
      nodes.push(iterator.referenceNode)
      if (iterator.referenceNode === range.endContainer) break
    }


    return nodes.map((n, index) => {
      const myRange = document.createRange()
      myRange.selectNode(n)
      if (index === 0) {
        myRange.setStart(n, range.startOffset)
      }
      if (index === nodes.length - 1) {
        myRange.setEnd(n, range.endOffset)
      }
      return myRange.getClientRects()[0]
    });
  }
}
