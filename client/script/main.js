new Vue({
  el: "#app",
  data: {
    isAbout: false,
    isContact: false,
    isAdd: false,
    isLogin: false,
    isRegister: false,
    isAdmin: false,
    items: [],
    cart: [],
    showCart: false,
    showCheckout: false,
    itemName: "",
    itemPrice: "",
    itemCategory: "",
    image: "",
    checkoutCart: "",
    checkoutTotal: "",
    username: "",
    password: "",
    user: "",
    uploadWait: false
  },
  methods: {
    addToCart: function(index) {
      let newItem = this.items[index];
      newItem.id = index;
      this.cart.push(newItem);
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },
    removeFromCart: function(index, removeAll) {
      let cart = this.cart;
      for (let i = cart.length - 1; i >= 0; i--) {
        if (cart[i].id === index) {
          cart.splice(i, 1);
          if (!removeAll) {
            return;
          }
        }
      }
    },
    openModal: function() {
      document.body.classList.add("freeze");
    },
    closeModal: function() {
      document.body.classList.remove("freeze");
    },
    checkout: function() {
      this.checkoutTotal = this.totalCost;
      this.checkoutCart = this.getCart;
      this.cart = [];
      localStorage.setItem("cart", []);
    },
    getAllItems: function() {
      let self = this;
      axios
        .get("http://localhost:3000/item")
        .then(function({ data }) {
          self.items = data.items;
          if (this.isAdmin) {
            this.isAdmin = true;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getCategory: function(category) {
      let self = this;
      axios
        .get(`http://localhost:3000/item?category=${category}`)
        .then(function({ data }) {
          self.items = data.items;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    handleUploadImage: function() {
      this.image = this.$refs.image.files[0];
      console.log(this.image);
    },
    submitAddItem: function() {
      this.uploadWait = true;
      let self = this;
      let formData = new FormData();
      formData.append("image", this.image);
      formData.append("name", this.itemName);
      formData.append("price", Number(this.itemPrice));
      formData.append("category", this.itemCategory);
      axios
        .post("http://localhost:3000/item", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          this.uploadWait = false;
          console.log(response);
          self.getAllItems();
          this.clearInput();
          this.isContact = false;
          this.isAbout = false;
          this.isAdd = false;
          swal("Success!", "Successfully add new item", "success");
        })
        .catch(err => {
          this.uploadWait = false;
          this.clearInput();
          swal("Error", "Price has to be a number", "error");
        });
    },
    deleteItem: function(itemId) {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this item!",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          axios
            .delete(`http://localhost:3000/item/${itemId}`)
            .then(({ data }) => {
              console.log(data);
              this.getAllItems();
              this.cleanInput();
            })
            .catch(err => {
              console.log(err);
            });
          swal("Item has been deleted", {
            icon: "success"
          });
        } else {
          swal("Item is not deleted");
        }
      });
    },
    getPrice(cost) {
      let string = cost.toString();
      let reverse = string
        .split("")
        .reverse()
        .join("");
      let array = reverse.match(/\d{1,3}/g);
      let costString = array
        .join(".")
        .split("")
        .reverse()
        .join("");
      return "Rp. " + costString + ".00";
    },
    login() {
      let payload = {
        username: this.username,
        password: this.password
      };
      axios
        .post("http://localhost:3000/login", payload)
        .then(({ data }) => {
          if (data.token) {
            this.isLogin = false;
            localStorage.setItem("token", data.token);
            if (data.role === "admin") {
              this.isAdmin = true;
            }
            this.cleanInput();
          } else {
            // this.warning = data;
            // this.hasWarning = true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    login() {
      let payload = {
        username: this.username,
        password: this.password
      };
      axios
        .post("http://localhost:3000/login", payload)
        .then(({ data }) => {
          if (data.token) {
            this.isLogin = false;
            localStorage.setItem("username", data.username);
            this.user = data.username;
            localStorage.setItem("token", data.token);
            if (data.role === "admin") {
              this.isAdmin = true;
            }
            this.clearInput();
          } else {
            // this.warning = data;
            // this.hasWarning = true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    register: function() {
      let payload = {
        username: this.username,
        password: this.password
      };
      axios
        .post("http://localhost:3000/register", payload)
        .then(({ data }) => {
          if (data.token) {
            this.isRegister = false;
            alert("Successfully add new admin");
            this.clearInput();
          } else {
            // this.warning = data;
            // this.hasWarning = true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    logout: function() {
      localStorage.removeItem("token");
      this.isAdmin = false;
    },
    clearInput() {
      this.itemName = "";
      this.itemPrice = "";
      this.itemCategory = "";
      this.image = "";
      this.username = "";
      this.password = "";
    },
    toHome() {
      this.isLogin = false;
      this.isRegister = false;
      this.isContact = false;
      this.isAbout = false;
      this.isAdd = false;
      this.getAllItems();
    },
    openLogin() {
      this.isLogin = true;
      this.isRegister = false;
      this.isContact = false;
      this.isAbout = false;
      this.isAdd = false;
    },
    openAddAdmin() {
      this.isLogin = false;
      this.isRegister = true;
      this.isContact = false;
      this.isAbout = false;
      this.isAdd = false;
    }
  },
  computed: {
    totalAll() {
      return this.cart.length;
    },
    totalCost() {
      let totalCost = this.cart.reduce((acc, item) => {
        acc += item.price;
        return acc;
      }, 0);
      let string = totalCost.toString();
      let reverse = string
        .split("")
        .reverse()
        .join("");
      let array = reverse.match(/\d{1,3}/g);
      let totalCostString = array
        .join(".")
        .split("")
        .reverse()
        .join("");
      return "Rp. " + totalCostString + ".00";
    },
    getCart() {
      let cart = [];
      for (let i = 0; i < this.cart.length; i++) {
        let item = this.cart[i];
        let [found] = cart.filter(filteredItem => filteredItem.id === item.id);
        if (found) {
          found.total += 1;
        } else {
          item.total = 1;
          cart.push(this.cart[i]);
        }
      }
      return cart;
    }
  },
  created: function() {
    if (localStorage.getItem("cart")) {
      this.cart = JSON.parse(localStorage.getItem("cart"));
    }
    this.getAllItems();
  }
});
