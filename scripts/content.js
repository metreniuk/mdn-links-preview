/**
 *
 *
 *
 * TODO:
 * - Fetch examples
 * - Support tooltip desired position (and make it CSS only)
 * - Add cache
 * - Add transition: on hover and on hover leave hide with a delay of 500ms
 * - Handle scroll bar width when aligning right
 * - Handle mobile
 * - Support not only <code> tag
 * - Write tests for: location detection
 *
 *
 *
 * DONE:
 * - Render tooltip on link hover
 * - Fetch title, description
 * - Hide on scroll
 * - Auto-position the tooltip
 *
 *
 * - Ignore current page (or just anchors)
 *
 */

console.log("@@ LOADED", chrome)

const TOOLTIP_WIDTH = 400

function listenLinks() {
  let tooltip = null
  let tooltipTimeout = null

  document.addEventListener("mouseover", (event) => {
    if (event.target?.tagName === "CODE" && event.target?.parentNode?.href) {
      showPreview(event.target.parentNode)
    }
  })

  document.addEventListener("mouseout", (event) => {
    let href
    if (event.target?.tagName !== "A" && event.target?.parentNode?.href) {
      href = event.target.parentNode.href
    } else if (event.target?.href) {
      href = event.target.href
    }
    removeTooltip()
  })

  window.addEventListener(
    "scroll",
    () => {
      removeTooltip()
    },
    { capture: true, passive: true }
  )

  function removeTooltip() {
    if (tooltip) {
      tooltip.remove()
      tooltip = null
    }

    // if (tooltipTimeout) {
    //   return
    // }
    // if (tooltip) {
    //   tooltipTimeout = setTimeout(() => {
    //     tooltip.remove()
    //     tooltip = null
    //     tooltipTimeout = null
    //   }, 450)
    // }
  }

  async function showPreview(link) {
    const href = link.href
    if (!href.startsWith("https://developer.mozilla.org/")) {
      return
    }
    removeTooltip()

    if (!cache.has(href)) {
      await fetchLinkData(href)
    }

    removeTooltip()

    const linkData = cache.get(href)

    const body = document.querySelector("body")

    tooltip = document.createElement("div")
    tooltip.setAttribute("role", "tooltip")
    tooltip.style.cssText = `
            position: fixed;
            display: block;
            padding: 12px;
            width: ${TOOLTIP_WIDTH}px;
            top: -1000px;
            left: -1000px;
            overflow: hidden;
            border: 1px dashed black;
            background: var(--background-primary);
            color: var(--text-primary);
            z-index: var(--z-index-top);
            opacity: 0;
            transition: opacity 0.2s ease 0.3s;
        `

    const description = document.createElement("p")
    description.innerHTML = linkData.description.replace(
      link.innerText,
      `<b>${link.innerText}</b>`
    )
    description.style.cssText = ``

    // tooltip.appendChild(title)
    tooltip.appendChild(description)

    body.appendChild(tooltip)

    const { top, left } = getTooltipLocation(link, tooltip)
    tooltip.style.cssText += `
        top: ${top}px;
        left: ${left}px;
        opacity: 1;
      `
  }
}

async function fetchLinkData(href) {
  return fetch(href)
    .then((x) => x.text())
    .then((x) => {
      const doc = new DOMParser().parseFromString(x, "text/html")
      //   const metaTitle = doc
      //     .querySelector('meta[property="og:title"]')
      //     .getAttribute("content")
      //     .replace("- Web APIs | MDN", "")
      const description = doc
        .querySelector('meta[property="og:description"]')
        .getAttribute("content")

      cache.set(href, { description })
    })
}

function getTooltipLocation(el, tooltip) {
  const rect = el.getBoundingClientRect()
  const tooltipRect = tooltip.getBoundingClientRect()
  let top = rect.bottom + 12
  let left = Math.max(
    12,
    Math.floor(rect.left + rect.width / 2 - tooltipRect.width / 2)
  )

  if (top + tooltipRect.height > window.innerHeight) {
    top = rect.top - 12 - tooltipRect.height
  }

  if (left + tooltipRect.width > window.innerWidth) {
    left = window.innerWidth - tooltipRect.width - 24
  }

  return {
    top,
    left,
  }
}

/**
 * Link meta:
 * description
 *
 */
const cache = new Map()

listenLinks()
