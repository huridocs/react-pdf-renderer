"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var SelectionHandler_1 = require("../SelectionHandler");
var enzyme_1 = require("enzyme");
var utils_1 = require("../utils");
describe('SelectionHandler', function () {
    beforeEach(function () {
        document.elementFromPoint = function () { return document.createElement('span'); };
    });
    it('should allow children', function () {
        mockGetSelection('None', '', []);
        mockSelectionRegionRectangles([{ x: 0, y: 0, height: 10, width: 10 }]);
        var selectionHandlerWrapper = enzyme_1.shallow(react_1.default.createElement(SelectionHandler_1.SelectionHandler, null,
            react_1.default.createElement("h1", null, "Title")));
        expect(selectionHandlerWrapper.text()).toEqual('Title');
    });
    it('should not call callback when no mouse up', function () {
        mockGetSelection('Range', '', [{ y: 0, x: 0, width: 0, height: 0 }]);
        mockSelectionRegionRectangles([{ x: 0, y: 0, height: 10, width: 10 }]);
        var callback = jest.fn();
        enzyme_1.shallow(react_1.default.createElement(SelectionHandler_1.SelectionHandler, { onTextSelection: callback }));
        expect(callback).not.toHaveBeenCalled();
    });
    it('should call deselect callback when a text has been deselected', function () {
        mockGetSelection('Caret', '', []);
        mockSelectionRegionRectangles([{ x: 0, y: 0, height: 10, width: 10 }]);
        var callback = jest.fn();
        var deselectCallback = jest.fn();
        var selectionHandlerWrapper = enzyme_1.shallow(react_1.default.createElement(SelectionHandler_1.SelectionHandler, { onTextSelection: callback, onTextDeselection: deselectCallback }));
        selectionHandlerWrapper.simulate('mouseup');
        expect(callback).not.toHaveBeenCalled();
        expect(deselectCallback).toHaveBeenCalled();
    });
    it('should return one selection rectangle', function () {
        mockGetSelection('Range', 'a text', [{ y: 0, x: 0, width: 0, height: 0 }]);
        mockSelectionRegionRectangles([{ x: 0, y: 0, height: 10, width: 10 }]);
        var callback = jest.fn();
        var selectionHandlerWrapper = enzyme_1.shallow(react_1.default.createElement(SelectionHandler_1.SelectionHandler, { onTextSelection: callback }));
        selectionHandlerWrapper.simulate('mouseup');
        expect(callback).toHaveBeenCalledWith({
            text: 'a text',
            selectionRectangles: [
                { top: 0, left: 0, width: 0, height: 0, regionId: '1' }
            ]
        });
    });
    it('should return absolute position relative to SelectionRegion', function () {
        mockGetSelection('Range', 'other text', [
            { x: 10, y: 10, width: 1, height: 1 }
        ]);
        mockSelectionRegionRectangles([{ x: 10, y: 10, height: 10, width: 10 }], ['other region']);
        var callback = jest.fn();
        var selectionHandlerWrapper = enzyme_1.shallow(react_1.default.createElement(SelectionHandler_1.SelectionHandler, { onTextSelection: callback }));
        selectionHandlerWrapper.simulate('mouseup');
        expect(callback).toHaveBeenCalledWith({
            text: 'other text',
            selectionRectangles: [
                { top: 0, left: 0, width: 1, height: 1, regionId: 'other region' }
            ]
        });
    });
    it('should return absolute position relative to two SelectionRegions', function () {
        mockGetSelection('Range', 'two rectangles selection', [
            { x: 5, y: 5, width: 1, height: 2 },
            {
                x: 15,
                y: 15,
                width: 3,
                height: 4
            }
        ]);
        mockSelectionRegionRectangles([
            { x: 0, y: 0, height: 10, width: 10 },
            { x: 10, y: 10, height: 10, width: 10 }
        ], ['1', '2']);
        var callback = jest.fn();
        var selectionHandlerWrapper = enzyme_1.shallow(react_1.default.createElement(SelectionHandler_1.SelectionHandler, { onTextSelection: callback }));
        selectionHandlerWrapper.simulate('mouseup');
        expect(callback).toHaveBeenCalledWith({
            text: 'two rectangles selection',
            selectionRectangles: [
                {
                    top: 5,
                    left: 5,
                    width: 1,
                    height: 2,
                    regionId: '1'
                },
                {
                    top: 5,
                    left: 5,
                    width: 3,
                    height: 4,
                    regionId: '2'
                }
            ]
        });
    });
});
var mockGetSelection = function (type, text, domRectListMock) {
    var domRectList = domRectListMock.reduce(function (obj, item, currentIndex) {
        obj[currentIndex] = item;
        return obj;
    }, {});
    spyOn(utils_1.utils, 'getTextSelectionRects').and.returnValue(domRectListMock);
    window.getSelection = function () {
        var mockRange = {};
        var mockSelection = {
            getRangeAt: function (index) {
                return mockRange;
            },
            type: type,
            toString: function () {
                return text;
            }
        };
        return mockSelection;
    };
};
function mockSelectionRegionRectangles(domRectListMock, rectangleIds) {
    if (rectangleIds === void 0) { rectangleIds = ['1']; }
    var regionsDomRectList = domRectListMock.map(function (domRectListMock) {
        return domRectListMock;
    });
    jest.spyOn(react_1.default, 'useRef').mockReturnValueOnce({
        current: {
            querySelectorAll: function () {
                return regionsDomRectList.map(function (domRect, index) {
                    return {
                        getAttribute: function () {
                            return rectangleIds[index];
                        },
                        getBoundingClientRect: function () {
                            return domRect;
                        }
                    };
                });
            }
        }
    });
}
function mockElementFromPoint(divCoordinateX, divCoordinateY) {
    document.elementFromPoint = function (x, y) {
        if (x === divCoordinateX && y === divCoordinateY) {
            return document.createElement('div');
        }
        return document.createElement('span');
    };
}
//# sourceMappingURL=SelectionHandler.spec.js.map