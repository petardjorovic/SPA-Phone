// views
let allPhonesView = document.querySelector('#all-phones-view');
let addPhonesView = document.querySelector('#add-phones-view');
let editDeleteView = document.querySelector('#edit-delete-view');
let editFormView = document.querySelector('#edit-form');


// inputs
let inputIdAddPhones = addPhonesView.querySelector('input[name="id"]');
let inputBrandAddPhones = addPhonesView.querySelector('input[name="brand"]');
let inputNameAddPhones = addPhonesView.querySelector('input[name="name"]');
let inputPriceAddPhones = addPhonesView.querySelector('input[name="price"]');
let inputAvailableAddPhones = addPhonesView.querySelector('select[name="available"]');
let searchInput = document.querySelector('#search-input');


// inputs Edit
let einputId = editFormView.querySelector('input[name="eid"]');
let einputBrand = editFormView.querySelector('input[name="ebrand"]');
let einputName = editFormView.querySelector('input[name="ename"]');
let einputPrice = editFormView.querySelector('input[name="eprice"]');
let einputAvailable = editFormView.querySelector('select[name="eavailable"]');


// tbodys
let allPhonesTbody = allPhonesView.querySelector('tbody');
let editDeleteTbody = editDeleteView.querySelector('tbody');


// start app
createMainTable()

// buttons
let allPhonesBtn = document.querySelector('#all-phones-btn');
let addPhonesBtn = document.querySelector('#add-phones-btn');
let editDeletePhonesBtn = document.querySelector('#edit-delete-phones-btn');
let saveBtn = document.querySelector('#save-btn');
let editBtn = document.querySelector('#esave-btn');
let searchBtn = document.querySelector('#search-btn');



// listeners
allPhonesBtn.addEventListener('click', displayAllPhonesView);
addPhonesBtn.addEventListener('click', displayAddPhonesView);
editDeletePhonesBtn.addEventListener('click', displayEditDeleteView);
saveBtn.addEventListener('click', saveInput);
editBtn.addEventListener('click', editPhone);
window.addEventListener('beforeunload', save);
searchInput.addEventListener('input', searchDatabase);
searchBtn.addEventListener('click', searchDatabase);


// functions
function saveInput(){
    let newPhone = {
        id : inputIdAddPhones.value,
        brand : inputBrandAddPhones.value,
        name : inputNameAddPhones.value,
        price : inputPriceAddPhones.value,
        available : checkAvailable(inputAvailableAddPhones.value)
    }
    db.push(newPhone);
    inputIdAddPhones.value = "";
    inputBrandAddPhones.value = "";
    inputNameAddPhones.value = "";
    inputPriceAddPhones.value = "";
    inputAvailableAddPhones.value = true;
    createMainTable();
    displayAllPhonesView();
}

function deletePhone(){
    let currentIndex = this.getAttribute('data-index');    
    let confirmDelete = confirm(`Da li ste sigurni da zelite da obrisete ${db[currentIndex].brand} ${db[currentIndex].name}?`);
    if(!confirmDelete) return;     

    db.splice(currentIndex,1);
    createMainTable();
    createEditDeleteTable();
    // displayAllPhonesView();
    displayEditDeleteView();
}

function editPhone(){
    let index = editBtn.getAttribute("data-index");
        
    let updatedPhone = {
        id : einputId.value,
        brand : einputBrand.value,
        name : einputName.value,
        price : einputPrice.value,
        available : checkAvailable(einputAvailable.value)
    }

    db[index] = updatedPhone;
    createMainTable();
    displayAllPhonesView()
            
}

function checkAvailable(val){
    if(val === "true"){
        return true
    }else{
        return false
    }
}

function displayAllPhonesView(){
    addPhonesView.style.display = "none";
    editDeleteView.style.display = "none";
    editFormView.style.display = "none";
    allPhonesView.style.display = "block";
    searchBtn.style.display = "block";
    searchInput.style.display = "block";
}

function displayAddPhonesView(){
    allPhonesView.style.display = "none";
    editDeleteView.style.display = "none";
    editFormView.style.display = "none";
    addPhonesView.style.display = "block";
    searchBtn.style.display = "none";
    searchInput.style.display = "none";
}

function displayEditDeleteView(){
    createEditDeleteTable();
    allPhonesView.style.display = "none";
    addPhonesView.style.display = "none";
    editFormView.style.display = "none";
    editDeleteView.style.display = "block";
    searchBtn.style.display = "block";
    searchInput.style.display = "block";
}

function displayEditForm() {
    let index = this.getAttribute("data-index");  // ovaj
    let currentPhone = db[index];
    editBtn.setAttribute("data-index", index);

    einputId.value = currentPhone.id;
    einputBrand.value = currentPhone.brand;
    einputName.value = currentPhone.name;
    einputPrice.value = currentPhone.price;
    einputAvailable.value = currentPhone.available;
    
    allPhonesView.style.display = "none";
    addPhonesView.style.display = "none";
    editDeleteView.style.display = "none";
    editFormView.style.display = "block";
    searchBtn.style.display = "none";
    searchInput.style.display = "none";
}



function createMainTable(filtered){
    let data = filtered || db;
    let phonesHtml = "";

    data.forEach(phone => {
        let available = phone.available ? `<td><button class="btn btn-sm btn-success">Yes</button></td>` : 
         `<td><button class="btn btn-sm btn-danger">No</button></td>`;
        phonesHtml += `
        <tr>
            <td>${phone.id}</td>
            <td>${phone.brand}</td>
            <td>${phone.name}</td>
            <td>${phone.price}</td>
            ${available}
            <td><button class="btn btn-sm btn-info">Read more</button></td>
        </tr>
        `.trim()
    });
    allPhonesTbody.innerHTML = phonesHtml;

}

function createEditDeleteTable(filtered){
    let data = filtered || db;
    let phonesHtml = "";

    data.forEach((phone, index) => {
        let available = phone.available ? `<td><button class="btn btn-sm btn-success">Yes</button></td>` : 
         `<td><button class="btn btn-sm btn-danger">No</button></td>`;
        phonesHtml += `
        <tr>
            <td>${phone.id}</td>
            <td>${phone.brand}</td>
            <td>${phone.name}</td>
            <td>${phone.price}</td>
            ${available}
            <td><button class="btn btn-sm btn-warning edit-phone-btn" data-index="${index}">Edit</button>
            <button class="btn btn-sm btn-danger delete-phone-btn" data-index="${index}">Delete</button></td>
        </tr>
        `.trim()
    });
    editDeleteTbody.innerHTML = phonesHtml;
    let deleteBtns = document.querySelectorAll('.delete-phone-btn');
    let editBtns = document.querySelectorAll('.edit-phone-btn');
    deleteBtns.forEach((btn, index)=>{
        btn.addEventListener('click', deletePhone);
        editBtns[index].addEventListener('click', displayEditForm);
    });
}

function searchDatabase(){
    let searchValue = searchInput.value.toLowerCase();
    
    let filtered = db.filter(user =>{
        return user.name.toLowerCase().includes(searchValue) || user.brand.toLowerCase().includes(searchValue) ||
         user.price.toLowerCase().includes(searchValue)
    })
    createMainTable(filtered);
    createEditDeleteTable(filtered);
}

function save(){
    localStorage.db = JSON.stringify(db);
}