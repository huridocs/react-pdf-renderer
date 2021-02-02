import React, { FunctionComponent } from 'react'
import { SelectionRectangle, TextSelection } from './TextSelection'


interface SelectionHandlerProps {
  onTextSelection?: (textSelection: TextSelection) => any,
  onTextDeselection?: () => any
}

const SelectionHandler: FunctionComponent<SelectionHandlerProps> = ({
                                                                      onTextSelection,
                                                                      onTextDeselection,
                                                                      children
                                                                    }) => {
  const ref = React.useRef(null)
  const getSelection = () => {
    if (!ref || !ref.current || !onTextSelection) {
      return
    }

    // @ts-ignore
    const regionsNodeList = ref.current.querySelectorAll('div[data-region-selector-id]')
    const regionElements = Array.prototype.slice.call(regionsNodeList)
    let selection = null
    if (window) {
      selection = window.getSelection()
    }

    if (!selection || selection.type !== 'Range') {
      if (onTextDeselection) onTextDeselection()
      return
    }

    const selectionDomRectList = selection.getRangeAt(0).getClientRects()

    const selectionSpanKeys = Object.keys(selectionDomRectList).filter(x  => {
      const selectionDomRect = selectionDomRectList[parseInt(x)]
      const element = document.elementFromPoint(selectionDomRect.x, selectionDomRect.y);
      return element.tagName === "SPAN";
    })

    const selectionRectangles = selectionSpanKeys.map((key: string) => {
        const selectionDomRect = selectionDomRectList[parseInt(key)]
        const regionElement = regionElements.find((x: HTMLDivElement) => {
          const regionDomRect = x.getBoundingClientRect()
          const horizontalMatch = regionDomRect.x <= selectionDomRect.x && selectionDomRect.x <= regionDomRect.x + regionDomRect.width
          const verticalMatch = regionDomRect.y <= selectionDomRect.y && selectionDomRect.y <= regionDomRect.y + regionDomRect.height
          return horizontalMatch && verticalMatch
        })
        const regionDomRect = regionElement.getBoundingClientRect()
        return {
          top: selectionDomRect.y - regionDomRect.y,
          left: selectionDomRect.x - regionDomRect.x,
          width: selectionDomRect.width,
          height: selectionDomRect.height,
          regionId: regionElement.getAttribute('data-region-selector-id')
        }
      }
    )

    onTextSelection({ text: selection.toString(), selectionRectangles: selectionRectangles })

  }

  return (<div ref={ref} onMouseUp={getSelection}>{children}</div>)
}


export { SelectionHandler }
