/**
 *
 *
 *
 * TODO:
 * - Support tooltip desired position (and make it CSS only)
 * - Fix multiple tooltips race condition
 * - Handle mobile
 * - Write tests for: location detection
 *
 *
 *
 *
 * - Handle scroll bar width when aligning right
 * - Support not only <code> tag
 * - Fetch examples
 *
 *
 *
 * DONE:
 * - Render tooltip on link hover
 * - Add focus
 * - Fetch title, description
 * - Hide on scroll
 * - Auto-position the tooltip
 * - Add transition: on hover and on hover leave hide with a delay of 500ms
 * - Add cache
 *
 *
 * - Ignore current page (or just anchors)
 *
 */

console.log("@@ LOADED", chrome)

const TOOLTIP_WIDTH = 400

function listenLinks() {
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
    removeTooltip(href)
  })

  document.addEventListener(
    "focus",
    (event) => {
      if (
        event.target?.href &&
        event.target?.childNodes.item(0)?.tagName === "CODE"
      ) {
        showPreview(event.target)
      }
    },
    { capture: true }
  )

  document.addEventListener(
    "blur",
    (event) => {
      if (
        event.target?.href &&
        event.target?.childNodes.item(0)?.tagName === "CODE"
      ) {
        removeTooltip(event.target.href)
      }
    },
    { capture: true }
  )

  window.addEventListener(
    "scroll",
    () => {
      //   tooltipsMap.forEach((val) => val.remove())
      //   tooltipsMap.clear()
      removeAllTooltips()
    },
    { capture: true, passive: true }
  )

  window.addEventListener(
    "keydown",
    (event) => {
      console.log("e", event.code)
      if (event.code === "Escape") {
        removeAllTooltips()
        event.stopPropagation()
      }
    },
    { capture: true, passive: true }
  )

  function removeTooltip(href, fast = false) {
    if (tooltipsMap.has(href)) {
      const tooltip = getTooltip(href)

      function hide() {
        requestAnimationFrame(() => {
          tooltip.style.opacity = "0"
          setTimeout(() => {
            tooltip.remove()
            tooltipsMap.delete(href)
          }, 400)
        })
      }
      if (fast) {
        hide()
      } else {
        setTimeout(() => {
          hide()
        }, 250)
      }
    }
  }

  function removeAllTooltips() {
    tooltipsMap.forEach((_, href) => removeTooltip(href, true))
  }

  async function showPreview(link) {
    const href = link.href
    if (!href.startsWith("https://developer.mozilla.org/")) {
      return
    }
    // removeTooltip(href)

    if (!cache.has(href)) {
      await fetchLinkData(href)
    }

    // removeTooltip(href)

    const linkData = cache.get(href)

    const body = document.querySelector("body")

    let tooltip = getTooltip(href)
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

const tooltipsMap = new Map()
function getTooltip(href) {
  if (!tooltipsMap.has(href)) {
    tooltipsMap.set(href, document.createElement("div"))
  }
  return tooltipsMap.get(href)
}

/**
 * Link meta:
 * description
 *
 */
const cache = new Map()

listenLinks()
