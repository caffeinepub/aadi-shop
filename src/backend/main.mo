import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Order "mo:core/Order";

import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type Category = {
    #Men;
    #Women;
    #Kids;
  };

  module Category {
    public func compare(a : Category, b : Category) : Order.Order {
      switch (a, b) {
        case (#Men, #Men) { #equal };
        case (#Men, _) { #less };
        case (#Women, #Men) { #greater };
        case (#Women, #Women) { #equal };
        case (#Women, #Kids) { #less };
        case (#Kids, #Kids) { #equal };
        case (#Kids, _) { #greater };
      };
    };
  };

  type Size = {
    #XS;
    #S;
    #M;
    #L;
    #XL;
    #XXL;
  };

  module Size {
    public func compare(a : Size, b : Size) : Order.Order {
      switch (a, b) {
        case (#XS, #XS) { #equal };
        case (#XS, _) { #less };
        case (#S, #XS) { #greater };
        case (#S, #S) { #equal };
        case (#S, _) { #less };
        case (#M, #M) { #equal };
        case (#M, #L) { #less };
        case (#M, _) { #greater };
        case (#L, #L) { #equal };
        case (#L, #XL) { #less };
        case (#L, _) { #greater };
        case (#XL, #XL) { #equal };
        case (#XL, #XXL) { #less };
        case (#XL, _) { #greater };
        case (#XXL, #XXL) { #equal };
        case (#XXL, _) { #greater };
      };
    };
  };

  public type Product = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
    category : Category;
    sizes : [Size];
    image : Text;
  };

  public type CartItem = {
    productId : Nat;
    size : Size;
    quantity : Nat;
  };

  public type CustomerInfo = {
    name : Text;
    email : Text;
    shippingAddress : Text;
    phone : Text;
  };

  public type Order = {
    id : Nat;
    customer : CustomerInfo;
    items : [CartItem];
    totalAmount : Nat;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    shippingAddress : Text;
    phone : Text;
  };

  let products = Map.empty<Nat, Product>();
  let orders = Map.empty<Nat, Order>();
  let carts = Map.empty<Principal, List.List<CartItem>>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextProductId = 1;
  var nextOrderId = 1;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Catalog (Public Access)
  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public query ({ caller }) func getProductsByCategory(category : Category) : async [Product] {
    products.values().toArray().filter(
      func(p) { p.category == category }
    );
  };

  public query ({ caller }) func getProduct(productId : Nat) : async ?Product {
    products.get(productId);
  };

  // Shopping Cart (User Access Required)
  public query ({ caller }) func getCart() : async [CartItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access cart");
    };
    switch (carts.get(caller)) {
      case (null) { [] };
      case (?cart) { cart.reverse().toArray() };
    };
  };

  public shared ({ caller }) func addToCart(productId : Nat, size : Size, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add to cart");
    };

    if (quantity == 0) {
      Runtime.trap("Quantity must be greater than 0");
    };

    if (not products.containsKey(productId)) {
      Runtime.trap("Product does not exist");
    };

    let item : CartItem = {
      productId;
      size;
      quantity;
    };

    let cart = switch (carts.get(caller)) {
      case (null) { List.empty<CartItem>() };
      case (?existing) { existing };
    };

    cart.add(item);
    carts.add(caller, cart);
  };

  public shared ({ caller }) func removeFromCart(productId : Nat, size : Size) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove from cart");
    };

    switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart is empty") };
      case (?cart) {
        let filtered = cart.filter(
          func(item) { not (item.productId == productId and item.size == size) }
        );
        carts.add(caller, filtered);
      };
    };
  };

  public shared ({ caller }) func clearCart() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can clear cart");
    };
    carts.remove(caller);
  };

  // Order Management (User Access Required)
  public shared ({ caller }) func placeOrder(customerInfo : CustomerInfo) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };

    let cart = switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart is empty") };
      case (?c) {
        if (c.isEmpty()) { Runtime.trap("Cart is empty") };
        c;
      };
    };

    let total = cart.foldLeft(
      0,
      func(acc, item) {
        switch (products.get(item.productId)) {
          case (null) { acc };
          case (?product) { acc + (product.price * item.quantity) };
        };
      },
    );

    let order : Order = {
      id = nextOrderId;
      customer = customerInfo;
      items = cart.reverse().toArray();
      totalAmount = total;
    };

    orders.add(nextOrderId, order);
    carts.remove(caller);
    nextOrderId += 1;
    order.id;
  };

  // Product Management (Admin Only)
  public shared ({ caller }) func addProduct(product : Product) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    let newProduct : Product = {
      product with id = nextProductId
    };
    products.add(nextProductId, newProduct);
    nextProductId += 1;
    newProduct.id;
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    if (not products.containsKey(product.id)) {
      Runtime.trap("Product does not exist");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func deleteProduct(productId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    if (not products.containsKey(productId)) {
      Runtime.trap("Product does not exist");
    };
    products.remove(productId);
  };

  // Order Management (Admin Only)
  public query ({ caller }) func getOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view orders");
    };
    orders.values().toArray();
  };
};
