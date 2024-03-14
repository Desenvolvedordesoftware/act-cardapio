const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checKoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")
const telPhone = document.getElementById("add-tel")
const telPhoneWarn = document.getElementById("tel-warn")

let cart = []

//Abrir o modal do carrinho
cartBtn.addEventListener("click", function () {
  updateCartModal()
  cartModal.style.display = "flex"
})

//Fecha o modal quando clicar fora
cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none"
  }
})

closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none"
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
    })

  }
  updateCartModal()
  Toastify({
    text: `${name}` + " foi adicionado em seu carrinho!",
    duration: 3000,
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
    cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

    cartItemElement.innerHTML = `
     <div class="flex items-center justify-between">
       <div>
         <p class="font-medium" >${item.name}</p>
         <p>Qtd.: ${item.quantity}</p>
         <p class="font-medium ">R$ ${item.price.toFixed(2)}</p>
         <p class="font-medium">-------------------------------</p>
       </div>
       <button class="remove-from-cart-btn" data-name="${item.name}">
        Remover
       </button>
     </div>
    `
    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement)
  })

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  })

  cartCounter.innerHTML = cart.length;
}

//função para remover o item do carrinho
cartItemsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-from-cart-btn")) {
    const name = event.target.getAttribute("data-name")
    removeItemcart(name);
  }

})

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
      ` *${item.name}* ${space} *Vlr-Und.:* ${item.price} | *QTde.:* ${item.quantity} | *Vlr-Total.:* ${(item.price * item.quantity).toFixed(2)} ${space} ------------------------------------------------------------ ${space}`
    )
  }).join("")

  const data = new Date();
  const id = ((data.getHours() * data.getMilliseconds()) + (data.getSeconds() + data.getMinutes()))
  const idOrder = id
  const message = encodeURIComponent(cartItems)
  const phone = telPhone.value

  window.open(`https://wa.me/${phone}?text= ------ *DGOIS RESTAURANTE* ------ %0A  %0A *Pedido.:* ${idOrder}%0A ------------------ *Produtos* ---------------------------- %0A ${message} *Total Itens.:* ${cartCounter.innerHTML}%0A *Valor Total.:* ${cartTotal.textContent}%0A -------------------- *Dados do cliente* ----------------- %0A *Endereço de entrega.:* %0A ${addressInput.value} %0A *Telefone de contato.:* %0A ${telPhone.value}`, "_blank")

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
  return hora >= 8 && hora < 13;
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
  }
}
