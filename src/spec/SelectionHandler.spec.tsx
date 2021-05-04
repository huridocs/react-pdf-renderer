import React from 'react'
import { SelectionHandler } from '../SelectionHandler'
import { shallow } from 'enzyme'
import { utils } from '../utils'

interface DomRectListMock {
  y: number
  x: number
  width: number
  height: number
}

describe('SelectionHandler', () => {
  beforeEach(() => {
    document.elementFromPoint = () => document.createElement('span')
  })

  it('should allow children', () => {
    mockGetSelection('None', '', [])
    mockSelectionRegionRectangles([{ x: 0, y: 0, height: 10, width: 10 }])

    const selectionHandlerWrapper = shallow(
      <SelectionHandler>
        <h1>Title</h1>
      </SelectionHandler>
    )
    expect(selectionHandlerWrapper.text()).toEqual('Title')
  })

  it('should not call callback when no mouse up', () => {
    mockGetSelection('Range', '', [{ y: 0, x: 0, width: 0, height: 0 }])
    mockSelectionRegionRectangles([{ x: 0, y: 0, height: 10, width: 10 }])

    const callback = jest.fn()

    shallow(<SelectionHandler onTextSelection={callback} />)
    expect(callback).not.toHaveBeenCalled()
  })

  it('should call deselect callback when a text has been deselected', () => {
    mockGetSelection('Caret', '', [])
    mockSelectionRegionRectangles([{ x: 0, y: 0, height: 10, width: 10 }])

    const callback = jest.fn()
    const deselectCallback = jest.fn()

    const selectionHandlerWrapper = shallow(
      <SelectionHandler
        onTextSelection={callback}
        onTextDeselection={deselectCallback}
      />
    )
    selectionHandlerWrapper.simulate('mouseup')
    expect(callback).not.toHaveBeenCalled()
    expect(deselectCallback).toHaveBeenCalled()
  })

  it('should return one selection rectangle', () => {
    mockGetSelection('Range', 'a text', [{ y: 0, x: 0, width: 0, height: 0 }])
    mockSelectionRegionRectangles([{ x: 0, y: 0, height: 10, width: 10 }])

    const callback = jest.fn()

    const selectionHandlerWrapper = shallow(
      <SelectionHandler onTextSelection={callback} />
    )
    selectionHandlerWrapper.simulate('mouseup')

    expect(callback).toHaveBeenCalledWith({
      text: 'a text',
      selectionRectangles: [
        { top: 0, left: 0, width: 0, height: 0, regionId: '1' }
      ]
    })
  })

  it('should return absolute position relative to SelectionRegion', () => {
    mockGetSelection('Range', 'other text', [
      { x: 10, y: 10, width: 1, height: 1 }
    ])
    mockSelectionRegionRectangles(
      [{ x: 10, y: 10, height: 10, width: 10 }],
      ['other region']
    )
    const callback = jest.fn()

    const selectionHandlerWrapper = shallow(
      <SelectionHandler onTextSelection={callback} />
    )

    selectionHandlerWrapper.simulate('mouseup')
    expect(callback).toHaveBeenCalledWith({
      text: 'other text',
      selectionRectangles: [
        { top: 0, left: 0, width: 1, height: 1, regionId: 'other region' }
      ]
    })
  })

  it('should return absolute position relative to two SelectionRegions', () => {
    mockGetSelection('Range', 'two rectangles selection', [
      { x: 5, y: 5, width: 1, height: 2 },
      {
        x: 15,
        y: 15,
        width: 3,
        height: 4
      }
    ])
    mockSelectionRegionRectangles(
      [
        { x: 0, y: 0, height: 10, width: 10 },
        { x: 10, y: 10, height: 10, width: 10 }
      ],
      ['1', '2']
    )
    const callback = jest.fn()

    const selectionHandlerWrapper = shallow(
      <SelectionHandler onTextSelection={callback} />
    )

    selectionHandlerWrapper.simulate('mouseup')
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
    })
  })
})

const mockGetSelection = (
  type: string,
  text: string,
  domRectListMock: DomRectListMock[]
) => {
  const domRectList: DOMRectList = (domRectListMock.reduce(
    (obj: any, item: DomRectListMock, currentIndex: number) => {
      obj[currentIndex] = item as DOMRect
      return obj
    },
    {}
  ) as unknown) as DOMRectList

  spyOn(utils, 'getTextSelectionRects').and.returnValue(domRectListMock);

  window.getSelection = () => {
    const mockRange = {}
    const mockSelection = {
      getRangeAt(index: number): Range {
        return mockRange as unknown as Range
      },
      type: type,
      toString(): string {
        return text
      }
    }

    return mockSelection as Selection
  }
}

function mockSelectionRegionRectangles(
  domRectListMock: DomRectListMock[],
  rectangleIds: string[] = ['1']
) {
  const regionsDomRectList = domRectListMock.map(domRectListMock => {
    return domRectListMock as DOMRect
  })

  jest.spyOn(React, 'useRef').mockReturnValueOnce({
    current: {
      querySelectorAll: () => {
        return regionsDomRectList.map((domRect, index) => {
          return {
            getAttribute: () => {
              return rectangleIds[index]
            },
            getBoundingClientRect: () => {
              return domRect
            }
          }
        })
      }
    }
  })
}

function mockElementFromPoint(divCoordinateX: number, divCoordinateY: number) {
  document.elementFromPoint = (x, y) => {
    if (x === divCoordinateX && y === divCoordinateY) {
      return document.createElement('div')
    }

    return document.createElement('span')
  }
}
