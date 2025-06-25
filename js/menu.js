// Menu page JavaScript
let menuItems = [];
let filteredItems = [];
let cart = [];

// Load XML data when page loads
document.addEventListener('DOMContentLoaded', function() {
  loadMenuData();
  setupEventListeners();
  updateCartDisplay();
});

// Load menu data from XML file
function loadMenuData() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'menu-data.xml', true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      parseXMLData(xhr.responseXML);
      filteredItems = menuItems;
      displayMenuItems(filteredItems);
    }
  };
  xhr.send();
}

// Parse XML data
function parseXMLData(xmlDoc) {
  var items = xmlDoc.getElementsByTagName('item');
  menuItems = [];
  
  for (var i = 0; i < items.length; i++) {
    var item = {
      id: items[i].getElementsByTagName('id')[0].textContent,
      name: items[i].getElementsByTagName('name')[0].textContent,
      category: items[i].getElementsByTagName('category')[0].textContent,
      price: parseFloat(items[i].getElementsByTagName('price')[0].textContent),
      image: items[i].getElementsByTagName('image')[0].textContent
    };
    menuItems.push(item);
  }
}

// Display menu items
function displayMenuItems(items) {
  var grid = document.getElementById('menuItemsGrid');
  grid.innerHTML = '';
  
  if (items.length === 0) {
    grid.innerHTML = '<div class="no-results">No items found matching your search.</div>';
    return;
  }
  
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var itemElement = document.createElement('div');
    itemElement.className = 'menu-item';
    
    itemElement.innerHTML = 
      '<div class="menu-item-image">' +
        '<img src="' + item.image + '" alt="' + item.name + '">' +
      '</div>' +
      '<div class="menu-item-content">' +
        '<div class="menu-item-name">' + item.name + '</div>' +
        '<div class="menu-item-price">$' + item.price.toFixed(2) + '</div>' +
        '<button class="add-to-cart-btn" onclick="addToCart(\'' + item.id + '\')">Add to Cart</button>' +
      '</div>';
    
    grid.appendChild(itemElement);
  }
}

// Setup event listeners
function setupEventListeners() {
  // Search functionality
  var searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', function() {
    filterItems();
  });
  
  // Filter buttons
  var filterButtons = document.querySelectorAll('.filter-btn');
  for (var i = 0; i < filterButtons.length; i++) {
    filterButtons[i].addEventListener('click', function() {
      // Remove active class from all buttons
      var allButtons = document.querySelectorAll('.filter-btn');
      for (var j = 0; j < allButtons.length; j++) {
        allButtons[j].classList.remove('active');
      }
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Filter items
      filterItems();
    });
  }
  
  // Checkout form submission
  var checkoutForm = document.getElementById('checkoutForm');
  checkoutForm.addEventListener('submit', function(e) {
    e.preventDefault();
    submitOrder();
  });
}

// Filter items based on search and category
function filterItems() {
  var searchTerm = document.getElementById('searchInput').value.toLowerCase();
  var activeCategory = document.querySelector('.filter-btn.active').getAttribute('data-category');
  
  filteredItems = menuItems.filter(function(item) {
    var matchesSearch = item.name.toLowerCase().indexOf(searchTerm) !== -1;
    var matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  displayMenuItems(filteredItems);
}

// Add to cart function
function addToCart(itemId) {
  var item = menuItems.find(function(item) {
    return item.id === itemId;
  });
  
  if (item) {
    // Check if item already exists in cart
    var existingItem = cart.find(function(cartItem) {
      return cartItem.id === itemId;
    });
    
    if (existingItem) {
      // Increase quantity
      existingItem.quantity += 1;
    } else {
      // Add new item to cart
      cart.push({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1
      });
    }
    
    updateCartDisplay();
  }
}

// Remove item from cart
function removeFromCart(itemId) {
  cart = cart.filter(function(item) {
    return item.id !== itemId;
  });
  updateCartDisplay();
}

// Update cart display
function updateCartDisplay() {
  var cartCount = document.getElementById('cartCount');
  var cartItems = document.getElementById('cartItems');
  var cartSummary = document.getElementById('cartSummary');
  var grandTotal = document.getElementById('grandTotal');
  
  // Update cart count
  var totalItems = cart.reduce(function(sum, item) {
    return sum + item.quantity;
  }, 0);
  cartCount.textContent = totalItems;
  
  // Update cart items display
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    cartSummary.style.display = 'none';
  } else {
    var cartHTML = '';
    var total = 0;
    
    for (var i = 0; i < cart.length; i++) {
      var item = cart[i];
      var itemTotal = item.price * item.quantity;
      total += itemTotal;
      
      cartHTML += 
        '<div class="cart-item">' +
          '<div class="cart-item-name">' + item.name + '</div>' +
          '<div class="cart-item-details">' +
            '<span class="cart-item-quantity">' + item.quantity + ' items</span>' +
            '<span class="cart-item-total">$' + itemTotal.toFixed(2) + '</span>' +
            '<button class="remove-item-btn" onclick="removeFromCart(\'' + item.id + '\')">Remove</button>' +
          '</div>' +
        '</div>';
    }
    
    cartItems.innerHTML = cartHTML;
    grandTotal.textContent = total.toFixed(2);
    cartSummary.style.display = 'block';
  }
}

// Toggle cart sidebar
function toggleCart() {
  var cartSidebar = document.getElementById('cartSidebar');
  var cartOverlay = document.getElementById('cartOverlay');
  
  cartSidebar.classList.toggle('open');
  cartOverlay.classList.toggle('active');
}

// Show checkout form
function showCheckoutForm() {
  var checkoutModal = document.getElementById('checkoutModal');
  var checkoutTotal = document.getElementById('checkoutTotal');
  
  // Calculate total
  var total = cart.reduce(function(sum, item) {
    return sum + (item.price * item.quantity);
  }, 0);
  
  checkoutTotal.textContent = total.toFixed(2);
  checkoutModal.classList.add('active');
}

// Hide checkout form
function hideCheckoutForm() {
  var checkoutModal = document.getElementById('checkoutModal');
  checkoutModal.classList.remove('active');
}

// Submit order
function submitOrder() {
  var customerName = document.getElementById('customerName').value;
  var phoneNumber = document.getElementById('phoneNumber').value;
  var address = document.getElementById('address').value;
  var cashOnDelivery = document.getElementById('cashOnDelivery').checked;
  
  if (!customerName || !phoneNumber || !address || !cashOnDelivery) {
    alert('Please fill in all fields and select Cash on Delivery');
    return;
  }
  
  // Calculate total
  var total = cart.reduce(function(sum, item) {
    return sum + (item.price * item.quantity);
  }, 0);
  
  // Create order summary
  var orderSummary = 'Order Confirmation\n\n';
  orderSummary += 'Customer: ' + customerName + '\n';
  orderSummary += 'Phone: ' + phoneNumber + '\n';
  orderSummary += 'Address: ' + address + '\n';
  orderSummary += 'Payment: Cash on Delivery\n\n';
  orderSummary += 'Items:\n';
  
  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];
    orderSummary += '- ' + item.name + ' x' + item.quantity + ' = $' + (item.price * item.quantity).toFixed(2) + '\n';
  }
  
  orderSummary += '\nTotal: $' + total.toFixed(2);
  
  alert(orderSummary + '\n\nThank you for your order! We will contact you shortly.');
  
  // Clear cart and close modals
  cart = [];
  updateCartDisplay();
  hideCheckoutForm();
  toggleCart();
  
  // Reset form
  document.getElementById('checkoutForm').reset();
}