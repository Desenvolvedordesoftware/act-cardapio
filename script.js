const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")

const modalItems = document.getElementById("modal-items")
const modalAddress = document.getElementById("modal-address")
const modalPayment = document.getElementById("modal-payment")

const cartItemsContainer = document.getElementById("cart-items")

const cartSubTotal = document.getElementById("cart-subtotal")
const cartTotal = document.getElementById("cart-total")

const checKoutBtn = document.getElementById("checkout-btn")
const addressBtn = document.getElementById("address-btn")
const paymentBtn = document.getElementById("payment-btn")

const closeModalBtn = document.getElementById("close-modal-btn")
const closeAddressBtn = document.getElementById("close-address-btn")
const closePaymentBtn = document.getElementById("close-payment-btn")

const cartCounter = document.getElementById("cart-count")

const addressNextInput = document.getElementById("address-next")
const addressNextWarn = document.getElementById("address-next-warn")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")
const telPhone = document.getElementById("add-tel")
const telPhoneWarn = document.getElementById("tel-warn")

const dateLegSpan = document.getElementById("date-leg-span")
const obsInput = document.getElementById("obs")
const addObsInput = document.getElementById("add-obs")

const selectPayment = document.getElementById("select-payment")

let cart = []

//Abrir o modal do carrinho
cartBtn.addEventListener("click", function () {
  updateCartModal()
  modalItems.style.display = "flex"
})

addressBtn.addEventListener("click", function () {
  const isOpenP = checkCompanyOpenP()
  const isOpenS = checkCompanyOpenS()

  if (cart.length === 0) {
    Toastify({
      text: " Ops não a itens em seu carrinho!",
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#ef4444",
      },
    }).showToast();
    return;
  }

  if (!isOpenP) {
    if (!isOpenS) {
      Toastify({
        text: " Ops o restaurente está fechado no momento!",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#ef4444",
        },
      }).showToast();
      return;
    }
  }

  updateCartModal()
  modalItems.style.display = "none"
  modalAddress.style.display = "flex"
})

paymentBtn.addEventListener("click", function () {

  if (telPhone.value === "") {
    telPhoneWarn.classList.remove("hidden")
    telPhone.classList.add("border-red-500")
    return;
  }
  
  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden")
    addressInput.classList.add("border-red-500")
    return;
  }

  if (addressNextInput.value === "") {
    addressNextWarn.classList.remove("hidden")
    addressNextInput.classList.add("border-red-500")
    return;
  }

  updateCartModal()
  modalAddress.style.display = "none"
  modalPayment.style.display = "flex"
})

//Fecha o modal quando clicar fora
modalItems.addEventListener("click", function (event) {
  if (event.target === modalItems) {
    modalItems.style.display = "none"
  }
})

closeModalBtn.addEventListener("click", function () {
  modalItems.style.display = "none"
})

closeAddressBtn.addEventListener("click", function () {
  modalAddress.style.display = "none"
  modalItems.style.display = "flex"
})

closePaymentBtn.addEventListener("click", function () {
  modalPayment.style.display = "none"
  modalAddress.style.display = "flex"
})

menu.addEventListener("click", function (event) {
  let parentButton = event.target.closest(".add-to-cart-btn")

  if (parentButton) {
    const name = parentButton.getAttribute("data-name")
    const price = parseFloat(parentButton.getAttribute("data-price"))
    // console.log(name+" / "+price)
    addToCart(name, price)
  }
})

//função para adicionar no carrinho
function addToCart(name, price) {
  const existingItem = cart.find(item => item.name === name)
  
  //ser o item já existe, aumenta apenas a quantidade +1
  if (existingItem) {

    existingItem.quantity += 1;

  } else {

    cart.push({
      name,
      price,
      quantity: 1,
      obs: "",
    })

  }
  updateCartModal()
  Toastify({
    text: `${name}` + " foi adicionado em seu carrinho!",
    duration: 1000,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
  }).showToast();
}

//Atualiza o carrinho
function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("flex", "justify-between", "mb-1", "flex-col")

    cartItemElement.innerHTML = `
     <div class="flex items-center justify-between gap-1">
       <div>
         <p class="font-medium" >${item.name}</p>
         
         <p class="font-medium ">R$ ${item.price.toFixed(2)}</p>
         <input type="text" onblur="addObscart(name)" placeholder="Observação" id="add-obs"
         class="w-full border-2 p-1 rounded my-1" name="${item.name}" value="${item.obs}"/>
         <p class="font-medium ">--------------------------------------------</p>

       </div>
       <div class="flex gap-1">
       <button class="bg-green-500 text-white px-4 py-1 rounded add-from-cart-btn" data-name="${item.name}">
        +
       </button>
       <p>Qtd.: ${item.quantity}</p>
       <button class="bg-red-500 text-white px-4 py-1 rounded remove-from-cart-btn" data-name="${item.name}">
        -
       </button>
       </div>
     </div>
    `
    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement)
  })

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  })
  cartSubTotal.textContent = cartTotal.textContent;
  cartCounter.innerHTML = cart.length;
}

//função para remover o item do carrinho
cartItemsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-from-cart-btn")) {
    const name = event.target.getAttribute("data-name")
    removeItemcart(name);
  }
  if (event.target.classList.contains("add-from-cart-btn")) {
    const name = event.target.getAttribute("data-name")
    addItemcart(name);
  }
  

})


function addObscart(name) {
  const index = cart.findIndex(item => item.name === name)

  addObsInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;
  
    if (inputValue !== "") {
      const item = cart[index];
      const add = document.querySelector("add-obs")
      console.log(add)


       item.obs = "addObsInput";
    }
  
  })
  
      Toastify({
        text: `${item.name}` + "Alteração realizado!",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
      }).showToast();
   

    updateCartModal();


}

function removeItemcart(name) {
  const index = cart.findIndex(item => item.name === name)

  if (index !== -1) {
    const item = cart[index];

    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCartModal();
      Toastify({
        text: `${item.name}` + " removido do seu carrinho!",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#ef4444",
        },
      }).showToast();
      return;
    }

    cart.splice(index, 1);
    updateCartModal();

  }
}
function addItemcart(name) {
  const index = cart.findIndex(item => item.name === name)

    const item = cart[index];

      item.quantity += 1;
      updateCartModal();
      Toastify({
        text: `${item.name}` + " adicionado no seu carrinho!",
        duration: 1000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
      }).showToast();
   
    return;
}

addressInput.addEventListener("input", function (event) {
  let inputValue = event.target.value;

  if (inputValue !== "") {
    addressInput.classList.remove("border-red-500")
    addressWarn.classList.add("hidden")
  }

})

telPhone.addEventListener("input", function (event) {
  let inputValue = event.target.value;

  if (inputValue !== "") {
    telPhone.classList.remove("border-red-500")
    telPhoneWarn.classList.add("hidden")
  }

})
//finalizar pedido
checKoutBtn.addEventListener("click", function () {
  const isOpenP = checkCompanyOpenP()
  const isOpenS = checkCompanyOpenS()

  if (!isOpenP) {
    if (!isOpenS) {
      Toastify({
        text: " Ops o restaurente está fechado no momento!",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#ef4444",
        },
      }).showToast();
      return;
    }
  }

  if (cart.length === 0) {
    Toastify({
      text: " Ops não a itens em seu carrinho!",
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#ef4444",
      },
    }).showToast();
    return;
  }
  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden")
    addressInput.classList.add("border-red-500")
    return;
  }

  if (telPhone.value === "") {
    telPhoneWarn.classList.remove("hidden")
    telPhone.classList.add("border-red-500")
    return;
  }

  //Enviar o pedido para api whatsapp
  const cartItems = cart.map((item) => {
    let space = "\n"
    return (
      ` *${item.name}* ${space} *Vlr-Und.:* ${item.price.toFixed(2)} | *QTde.:* ${item.quantity} | *Vlr-Total.:* ${(item.price * item.quantity).toFixed(2)} ${space} *Obs.:* ${item.obs} ${space} ------------------------------------------------------------ ${space}`
    )
  }).join("")

  const data = new Date();
  const id = ((data.getHours() * data.getMilliseconds()) + (data.getSeconds() + data.getMinutes()));
  const idOrder = id*1024;
  const message = encodeURIComponent(cartItems);
  const phone = telPhone.value;

  console.log(idOrder)

  window.open(`https://wa.me/${phone}?text= ------ *DGOIS RESTAURANTE* ------ %0A  %0A *Pedido.:* ${idOrder}%0A ------------------ *Produtos* ---------------------------- %0A ${message} *Pagamento pelo.:* ${selectPayment.value} %0A *Total Valor.:* ${cartTotal.textContent} %0A *Total Prod.:* ${cartCounter.innerHTML} %0A ------------------ *Entregar no endereço* --------------- %0A *Endereço de entrega.:* %0A ${addressInput.value} %0A *Telefone de contato.:* %0A ${telPhone.value} %0A *Próximo a.:* %0A ${addressNextInput.value} %0A *Observações.:* %0A ${obsInput.value}`, "_blank")

  cart = [];
  addressInput.value = "";
  telPhone.value = "";
  updateCartModal();
})

//Verificar a hora e manipular o card horário
function checkCompanyOpenP() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 11 && hora < 14;
  //true = empresa está aberta
}

function checkCompanyOpenS() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 1 && hora < 23;
}

const spanItem = document.getElementById("date-span")
const isOpenP = checkCompanyOpenP()
const isOpenS = checkCompanyOpenS()

if (isOpenP) {
  spanItem.classList.remove("bg-red-500")
  spanItem.classList.add("bg-green-600")
} else {
  if (isOpenS) {
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
  } else {
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
    dateLegSpan.classList.remove("hidden")
  }
}
