const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const columnElArray = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Initialize Arrays
let listArray = [];
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
const arrayNames = ['backlog', 'progress', 'complete', 'onHold'];

// Drag Functionality
let draggedItem;
let currentColumnEl;
let dragging = false;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArray = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
  listArray.forEach((array, i) => {
    localStorage.setItem(`${arrayNames[i]}Items`, JSON.stringify(array));
  });
}

// Create DOM Elements for each list item
// Parameters: UL element, index of column (0-3), item to add to column, index of item to add to column
function createItemEl(columnEl, columnIndex, item, itemIndex) {
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.id = itemIndex;
  listEl.textContent = item;
  listEl.contentEditable = true;
  listEl.setAttribute('onfocusout', `updateItem(${columnIndex}, ${itemIndex})`);

  listEl.draggable = true;
  listEl.setAttribute('ondragstart', 'drag(event)');

  columnEl.append(listEl);
}

function updateColumnInDOM(ColumnEl, columnIndex, ColumnArray) {
  ColumnEl.textContent = '';   // reset
  ColumnArray = ColumnArray.filter(item => item !== null);
  ColumnArray.forEach((item, i) => {
    createItemEl(ColumnEl, columnIndex, item, i);
  });
  return ColumnArray;
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  backlogListArray = updateColumnInDOM(backlogList, arrayNames.indexOf('backlog'), backlogListArray);
  progressListArray = updateColumnInDOM(progressList, arrayNames.indexOf('progress'), progressListArray);
  completeListArray = updateColumnInDOM(completeList, arrayNames.indexOf('complete'), completeListArray);
  onHoldListArray = updateColumnInDOM(onHoldList, arrayNames.indexOf('onHold'), onHoldListArray);

  // Update Local Storage
  updateSavedColumns();
}

// Update arrays after drag and drop
function updateArrays() {
  backlogListArray = Array.from(backlogList.children).map(itemEl => itemEl.textContent);
  progressListArray = Array.from(progressList.children).map(itemEl => itemEl.textContent);
  completeListArray = Array.from(completeList.children).map(itemEl => itemEl.textContent);
  onHoldListArray = Array.from(onHoldList.children).map(itemEl => itemEl.textContent);
}

// On clicking Save item - add the item to column, Reset Text Box
function addItemToColumn(column) {
  const i = arrayNames.indexOf(column);
  const itemText = addItems[i].textContent;
  listArray[i].push(itemText);
  addItems[i].textContent = '';
  updateDOM();
}

// Update/Delete Item from Column and Update Array
function updateItem(columnIndex, itemIndex) {
  if (!dragging) {
    let arrayToBeUpdated = listArray[columnIndex];
    const itemsInColumnEl = columnElArray[columnIndex].children;
    const newText = itemsInColumnEl[itemIndex].textContent;
    if (!newText) {
      delete arrayToBeUpdated[itemIndex];
    } else {
      arrayToBeUpdated[itemIndex] = newText;
    }
    updateDOM();
  }
}

// Event Listener Functions ----------------

// When Item starts dragging
function drag(event) {
  draggedItem = event.target;
  dragging = true;
}

// Column allows for item to be dropped
function allowDrop(event) {
  event.preventDefault();
}

// When item enters the column area
function dragEnter(column) {
  const columnEl = columnElArray[arrayNames.indexOf(column)];
  columnEl.classList.add('over');
  currentColumnEl = columnEl;
}

// When item is dropped
function drop(event) {
  event.preventDefault();

  // Remove background color / padding
  columnElArray.forEach(columnEl => {
    columnEl.classList.remove('over');
  });

  // Add item to column
  const parentEl = currentColumnEl;
  parentEl.append(draggedItem);
  dragging = false;

  updateArrays();
  updateDOM();
}

// On clicking Add Item
function showInputBox(column) {
  const i = arrayNames.indexOf(column);
  addBtns[i].style.visibility = 'hidden';
  saveItemBtns[i].style.display = 'flex';
  addItemContainers[i].style.display = 'flex';
  addItems[i].focus();
}

// On clicking Save Item
function hideInputBox(column) {
  const i = arrayNames.indexOf(column);
  addBtns[i].style.visibility = 'visible';
  saveItemBtns[i].style.display = 'none';
  addItemContainers[i].style.display = 'none';
  addItemToColumn(column);
}

// On Load
getSavedColumns();
updateDOM();