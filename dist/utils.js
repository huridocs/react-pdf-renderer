"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.utils = void 0;
//needs actual DOM testing
exports.utils = {
    getTextSelectionRects: function (range) {
        var iterator = document.createNodeIterator(range.commonAncestorContainer, NodeFilter.SHOW_ALL, // pre-filter
        {
            // custom filter
            acceptNode: function (node) {
                return NodeFilter.FILTER_ACCEPT;
            }
        });
        var nodes = [];
        while (iterator.nextNode()) {
            if (nodes.length === 0 &&
                iterator.referenceNode !== range.startContainer)
                continue;
            if (iterator.referenceNode.nodeName !== '#text')
                continue;
            nodes.push(iterator.referenceNode);
            if (iterator.referenceNode === range.endContainer)
                break;
        }
        return nodes.map(function (n, index) {
            var myRange = document.createRange();
            myRange.selectNode(n);
            if (index === 0) {
                myRange.setStart(n, range.startOffset);
            }
            if (index === nodes.length - 1) {
                myRange.setEnd(n, range.endOffset);
            }
            return myRange.getClientRects()[0];
        });
    }
};
//# sourceMappingURL=utils.js.map