const addGroceryForm = document.querySelector(".add-grocery-form");
const listItemsContainer = document.querySelector(".list-items-container");

// Execute function to initialize app
initApp();

// Declare function of initilization of app
function initApp() {
  // Execute function to initially render data in localStorage
  initRender();

  // Add event listener for form submit
  addGroceryForm.addEventListener("submit", (e) => formSubmitHandler(e));
}

// Declare function of initial rendering of data in localStorage
function initRender() {
  // access data in localStprage
  const myGroceries = JSON.parse(localStorage.getItem("myGroceries"));

  // safe guard
  if (!myGroceries) return;

  // rendering all the data from localStprage
  myGroceries.forEach(({ id, name, amount, isBought }) => {
    listItemsContainer.insertAdjacentHTML(
      "beforeend",
      `
      <div class="list-item" id=${id}>
        <input type="checkbox" ${isBought && "checked"}/>
        <span class="item-name ${isBought && "checked-item"}">${name}</span>
        <span class="item-amount ${isBought && "checked-item"}">${amount}</span>
        <button class="delete-button">Delete</button>
      </div>`
    );
  });

  // acquire all checkbox inputs of list items
  const checkboxInputs = document.querySelectorAll(".list-item input");

  // add event listeners for change event of all checkbox inputs
  checkboxInputs.forEach((el) =>
    el.addEventListener("change", (e) => toggleCheckItem(e))
  );

  // acquire all delete buttons of list items
  const deleteButtons = document.querySelectorAll(".delete-button");

  // add event listeners for all delete buttons
  deleteButtons.forEach((btn) =>
    btn.addEventListener("click", (e) => deleteItem(e))
  );
}

// Declare function of handling submit data and add item to list
function formSubmitHandler(e) {
  e.preventDefault();

  // access to form data
  const formData = new FormData(addGroceryForm);
  const name = formData.get("name");
  const amount = formData.get("amount");

  // add this item
  addItem(name, amount);

  // clean up all inputs text field
  const formInputs = document.querySelectorAll(".add-grocery-form input");
  formInputs.forEach((el) => (el.value = ""));
}

// Generate a simple unique ID
function generateId() {
  return Date.now().toString();
}

// Declare function of adding new item
function addItem(name, amount) {
  // generate new item
  const id = generateId();
  const newItem = `
    <div class="list-item" id=${id}>
        <input type="checkbox" />
        <span class="item-name">${name}</span>
        <span class="item-amount">${amount}</span>
        <button class="delete-button">Delete</button>
    </div>`;

  // insert this item into list container after the last child
  listItemsContainer.insertAdjacentHTML("beforeend", newItem);

  // add event listener of change event for checkbox input
  const newItemElement = listItemsContainer.children.item(
    listItemsContainer.children.length - 1
  );
  newItemElement
    .querySelector("input")
    .addEventListener("change", (e) => toggleCheckItem(e));

  // add event listener of 'click to delete' for this new item
  newItemElement
    .querySelector(".delete-button")
    .addEventListener("click", (e) => deleteItem(e));

  // add item to localStorage
  addItemToLocalStorage({ id, name, amount, isBought: false });
}

// Declare function of deleting item
function deleteItem(e) {
  e.preventDefault();

  // get the target item
  const listItem = e.target.closest(".list-item");

  // remove it from localStorage
  removeItemFromLocalStorage(listItem.id);

  // remove it from interface
  listItem.remove();
}

// Declare function of toggle the checked status of item
function toggleCheckItem(e) {
  const listItem = e.target.closest(".list-item");
  const itemName = listItem.children[1];
  const itemAmount = listItem.children[2];

  itemName.classList.toggle("checked-item");
  itemAmount.classList.toggle("checked-item");

  // update the isBought status for data in localStorage
  updateBoughtInLocalStorage(listItem.id);
}

// Declare function of adding item from localStorage
function addItemToLocalStorage(grocery) {
  const myGroceries = JSON.parse(localStorage.getItem("myGroceries"));

  if (!myGroceries)
    localStorage.setItem("myGroceries", JSON.stringify([grocery]));
  else
    localStorage.setItem(
      "myGroceries",
      JSON.stringify([...myGroceries, grocery])
    );
}

// Declare function of removing item from localStorage
function removeItemFromLocalStorage(id) {
  const myGroceries = JSON.parse(localStorage.getItem("myGroceries"));

  const newGroceries = myGroceries.filter((el) => el.id !== id);
  localStorage.setItem("myGroceries", JSON.stringify(newGroceries));
}

// Declare function of update 'isBought' of data in localStorage
function updateBoughtInLocalStorage(id) {
  const myGroceries = JSON.parse(localStorage.getItem("myGroceries"));

  myGroceries.forEach((el) => {
    if (el.id === id) el.isBought = !el.isBought;
  });

  localStorage.setItem("myGroceries", JSON.stringify(myGroceries));
}
