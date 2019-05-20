/* global Blob Worker alert localStorage */

let jsWorker
let wasmWorker

if (!window.Worker) {
  alert('Your web browser does not support WebWorkers and will therefore be unable to run this website.')
} else {
  jsWorker = new Worker('js/jsWorker.js')
  wasmWorker = new Worker('js/wasmWorker.js')

  jsWorker.onmessage = wasmWorker.onmessage = (e) => {
    let primes = e.data.primes
    let time = e.data.time
    showTime(time)
    showPrimes(primes)
  }
}

function showPrimes (res) {
  if (typeof res === 'string') {
    $('#list').textContent = res
  } else {
    $('#list').innerHTML = '<p class="center">Click <a id="download-link">here</a> to download a text file containing the generated primes.</p>'
    let blob = new Blob(res, {type: 'text/plain'})
    let url = URL.createObjectURL(blob)
    let link = $('#download-link')
    link.setAttribute('href', url)
    link.setAttribute('download', 'primes.txt')
    link.setAttribute('target', '_self')
  }
  toggleSpinner(false)
}

function showTime (time) {
  let timeSec = (time / 1000).toFixed(4)
  $('#time-info').textContent = `Computation completed in ${timeSec} seconds.`
}

function toggleSpinner (bool) {
  if (bool) {
    $('button').setAttribute('disabled', 'disabled')
    $('#input-1').setAttribute('disabled', 'disabled')
    $('#toggle-wasm').setAttribute('disabled', 'disabled')
    $('#toggle-js').setAttribute('disabled', 'disabled')
    $('.spinner').style.display = 'block'
    $('#list').textContent = $('#time-info').textContent = ''
    $('#settings-button').classList.add('disabled')
  } else {
    $('button').removeAttribute('disabled')
    $('#input-1').removeAttribute('disabled')
    $('#toggle-wasm').removeAttribute('disabled')
    $('#toggle-js').removeAttribute('disabled')
    $('#settings-button').classList.remove('disabled')
    $('.spinner').style.display = 'none'
  }
}

function $ (str) { return document.querySelector(str) }

$('button').addEventListener('click', function () {
  let count = parseInt($('input').value)
  if (isNaN(count)) {
    alert('Illegal number input.')
    return
  }
  let displayMode = $('input[name="dl-toggle"]:checked').value
  let mode64Bit = $('input[name="wasm-mode-toggle"]:checked').value === '64'
  let message = {
    'count': count,
    'start': 0,
    'returnString': displayMode === 'display' || (count < 500000 && displayMode !== 'download'),
    'mode64Bit': mode64Bit // only used by WASM; ignored by JS
  }
  let startNumber = parseInt($('#starting-number-input').value)
  if (!isNaN(startNumber)) {
    if (startNumber >= 0) {
      message['start'] = startNumber
    } else {
      alert('Negative starting numbers are not allowed.')
      return
    }
  }
  if ($('#toggle-wasm').checked) {
    wasmWorker.postMessage(message)
  } else {
    jsWorker.postMessage(message)
  }
  toggleSpinner(true)
}, false)

$('#settings-button').addEventListener('click', function (e) {
  e.preventDefault()
  activateDialog()
  e.stopPropagation()
}, false)
$('.dialog__close').addEventListener('click', function () {
  deactivateDialog()
}, false)
document.addEventListener('keyup', function (e) {
  if (e.keyCode === 27) {
    deactivateDialog()
  }
}, false)

function activateDialog () {
  $('#darkener').style.display = 'block'
  $('.dialog').classList.add('dialog--active')
}

function deactivateDialog () {
  $('#darkener').style.display = 'none'
  $('.dialog').classList.remove('dialog--active')
}

$('.dl-toggle-container').addEventListener('click', function (e) {
  let leftSel = $('.dl-toggle-container .toggle-left')
  let centerSel = $('.dl-toggle-container .toggle-center')
  let rightSel = $('.dl-toggle-container .toggle-right')

  let checkedEl = $('.dl-toggle-container .toggle:checked')
  let cl = checkedEl.classList
  let buttonType = cl.contains('toggle-left') ? 'left' : cl.contains('toggle-center') ? 'center' : 'right'
  removePosClasses(leftSel, centerSel, rightSel)
  switch (buttonType) {
    case 'left':
      leftSel.classList.add('pos-self')
      centerSel.classList.add('pos-left-1')
      rightSel.classList.add('pos-left-2')
      break
    case 'center':
      leftSel.classList.add('pos-right-1')
      centerSel.classList.add('pos-self')
      rightSel.classList.add('pos-left-1')
      break
    case 'right':
      leftSel.classList.add('pos-right-2')
      centerSel.classList.add('pos-right-1')
      rightSel.classList.add('pos-self')
      break
  }
}, false)

function removePosClasses (...els) {
  for (let el of els) {
    el.classList.remove('pos-self')
    el.classList.remove('pos-right-1')
    el.classList.remove('pos-right-2')
    el.classList.remove('pos-left-1')
    el.classList.remove('pos-left-2')
  }
}

document.body.addEventListener('keypress', function (e) {
  let activeElement = document.activeElement
  if (e.key === 'd' && !(activeElement.tagName.toLowerCase() === 'input' && activeElement.type.toLowerCase() === 'text')) toggleDarkMode(true)
}, true)

function toggleDarkMode () {
  let html = $('html')
  if (html.classList.contains('dark')) {
    html.classList.remove('dark')
    localStorage['colorMode'] = 'light'
  } else {
    html.classList.add('dark')
    localStorage['colorMode'] = 'dark'
  }
}
