import { useEffect, useState } from 'react'

/**
 * @Types
 */
export type UniqueFontObject = {
  readonly fontUrl: string
  readonly key: string
}

/**
 * @Utils
 */

/**
 * createLinkElement
 * @param fontUrlStruct {UniqueFontObject | String}
 * @returns element {HtmlLinkElement}
 */
const createLinkElement = (fontUrlStruct: UniqueFontObject | string) => {
  const element = document.createElement('link')
  element.rel = 'stylesheet'
  if (typeof fontUrlStruct === 'string') {
    element.href = fontUrlStruct;
    return element
  }
  element.href = fontUrlStruct.fontUrl
  element.id = fontUrlStruct.key
  return element;
}

/**
 * Removes an HtmlElement from the DOM, used in useEffect cleanup
 * @param element {HtmlElement}
 */
const destroyLinkElement = (element: HTMLElement) => {
  document.head.removeChild(element)
}

/**
 * Checks the DOM for an existing link el with the corresponding href
 * @param fontUrlStruct {UniqueFontObject | String}
 * @returns Boolean
 */
const checkDOMTreeForLinkEl = (fontUrlStruct: UniqueFontObject | string) => {
  if (typeof fontUrlStruct === 'string') {
    let linkPreviouslyAppended = false;
    const linkEls = document.querySelectorAll(`link[href=${fontUrlStruct}]`);
    if (linkEls.length !== 0) {
      linkPreviouslyAppended = true;
    }
    return linkPreviouslyAppended;
  }
  const elOrUndefined = document.querySelector('#' + fontUrlStruct.key)
  if (!!elOrUndefined) return true
  return false
}

/**
 * MAIN EXPORT
 */

/**
 * mounts a link element to the dom on hook execution from within
 * the react component tree
 * @param fontObj 
 * @returns StateObject 
 */
const useExtraneousFont = (fontObj: UniqueFontObject | string) => {
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true);
    if (!checkDOMTreeForLinkEl(fontObj)) {
      try {
        const e = createLinkElement(fontObj)
        document.head.appendChild(e)
        setLoading(false);
        setReady(true);
        return () => {
          destroyLinkElement(e)
        }
      } catch (err: any) {
        setLoading(false);
        setFailed(true);
        console.error('[useExtraneousFont]:::' + (err as Error).message)
      }
    } else {
      setLoading(false);
      setReady(true);
    }
  }, [])
  return { ready, failed, loading }
}

export { useExtraneousFont }
