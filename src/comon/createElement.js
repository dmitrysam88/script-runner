function isElement(element) {
  return element instanceof Element || element instanceof HTMLDocument;
}

module.exports = function (type, options, content) {
  const curElement = document.createElement(type);
  const regExpEvents = /^on[^ ].*/;

  Object.entries(options).forEach(([key, value]) => {
    if (key === 'parent') {
      if (isElement(value)) value.appendChild(curElement);
    } else if (regExpEvents.test(key)) {
      curElement.addEventListener(key.replace('on', '').toLowerCase(), value);
    } else {
      curElement.setAttribute(key, key === 'value' && value == null ? "" : value);
    }
  });

  if (content) curElement.innerHTML = content;

  return curElement;
}