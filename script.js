const addGroceryForm = document.querySelector(".add-grocery-form");
const formInputs = document.querySelectorAll(".add-grocery-form input");
const listItemsContainer = document.querySelector(".list-items-container");

// Add event listener for form submit
addGroceryForm.addEventListener("submit", (e) => formSubmitHandler(e));

// Declare function of initial rendering of data in localStorage
function initialRenderGroceries() {
  // access data in localStprage
  const myGroceries = JSON.parse(localStorage.getItem("myGroceries"));

  // safe guard
  if (!myGroceries) return;

  // rendering all the data from localStprage
  myGroceries.forEach(({ id, name, amount, unit }) =>
    listItemsContainer.insertAdjacentHTML(
      "beforeend",
      `
      <div class="list-item" id=${id}>
        <input type="checkbox" />
        <span class="item-name">${name}</span>
        <span class="item-unit">${amount} ${unit}</span>
        <button class="delete-button">Delete</button>
      </div>`
    )
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
  const unit = formData.get("unit");

  // add this item
  addItem(name, amount, unit);

  // clean up all inputs text field
  formInputs.forEach((el) => (el.value = ""));
}

// Declare function of adding new item
function addItem(name, amount, unit) {
  // generate new item
  const id = generateId();
  const newItem = `
    <div class="list-item" id=${id}>
        <input type="checkbox" />
        <span class="item-name">${name}</span>
        <span class="item-unit">${amount} ${unit}</span>
        <button class="delete-button">Delete</button>
    </div>`;

  // insert this item into list container after the last child
  listItemsContainer.insertAdjacentHTML("beforeend", newItem);

  // add event listener of 'click to delete' for this new item
  listItemsContainer.children
    .item(listItemsContainer.children.length - 1)
    .querySelector(".delete-button")
    .addEventListener("click", (e) => deleteItem(e));

  // add item to localStorage
  addItemToLocalStorage({ id, name, amount, unit });
}

// Generate a simple random 9 digits Id
function generateId() {
  return Math.floor(Math.random() * Math.pow(10, 9)).toString();
}

// Declare function of deleting item
function deleteItem(e) {
  e.preventDefault();

  // get the target item
  const targetItem = e.target.closest(".list-item");

  // remove it from localStorage
  removeItemFromLocalStorage(targetItem.id);

  // remove it from interface
  targetItem.remove();
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

// Execute function
initialRenderGroceries();
