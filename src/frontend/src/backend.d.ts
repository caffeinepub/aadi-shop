import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    id: bigint;
    name: string;
    description: string;
    sizes: Array<Size>;
    category: Category;
    image: string;
    price: bigint;
}
export interface CartItem {
    size: Size;
    productId: bigint;
    quantity: bigint;
}
export interface CustomerInfo {
    name: string;
    email: string;
    shippingAddress: string;
    phone: string;
}
export interface Order {
    id: bigint;
    customer: CustomerInfo;
    totalAmount: bigint;
    items: Array<CartItem>;
}
export interface UserProfile {
    name: string;
    email: string;
    shippingAddress: string;
    phone: string;
}
export enum Category {
    Men = "Men",
    Kids = "Kids",
    Women = "Women"
}
export enum Size {
    L = "L",
    M = "M",
    S = "S",
    XL = "XL",
    XS = "XS",
    XXL = "XXL"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(product: Product): Promise<bigint>;
    addToCart(productId: bigint, size: Size, quantity: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearCart(): Promise<void>;
    deleteProduct(productId: bigint): Promise<void>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Array<CartItem>>;
    getOrders(): Promise<Array<Order>>;
    getProduct(productId: bigint): Promise<Product | null>;
    getProductsByCategory(category: Category): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(customerInfo: CustomerInfo): Promise<bigint>;
    removeFromCart(productId: bigint, size: Size): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateProduct(product: Product): Promise<void>;
}
