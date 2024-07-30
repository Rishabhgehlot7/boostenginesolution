"use client";
import ReturnRequest from "@/components/custom/ReturnRequest";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useUser } from "@/lib/hooks/useUser";
import rating from "@/public/rating.svg";
import axios from "axios";
import { User, UserCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RingLoader } from "react-spinners";

export interface IUser {
  username: string;
  name: string;
  email: string;
  password: string;
  phone: number;
  role: "customer" | "admin";
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  cart: [];
  orders: [];
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  createdAt: Date;
}
interface User {
  _id: string;
  email: string;
  name: string;
}
interface ProductItem {
  product: {
    _id: string;
    name: string;
  };
  quantity: number;
  price: number;
  _id: string;
}

interface Order {
  _id: string;
  user: User;
  products: ProductItem[];
  status: string;
  total: number;
  paymentMethod: string;
  createdAt: string;
  returnStatus: "requested" | "approved" | "rejected" | null;
  returnReason: string;
  returnRequestedAt: Date;
}
function UserProfile() {
  const { user, error, updateUser, setLoadingState, setErrorState } = useUser();
  const [formData, setFormData] = useState<Partial<IUser>>({});
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data from your API
    axios
      .get(`/api/users/getUserById/`)
      .then((response) => {
        updateUser(response.data);
        setFormData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        // // // console.error("Error fetching user data:", error);
      });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .put(`/api/users/updateUser/`, formData)
      .then((response) => {
        updateUser(response.data);
        // // // console.log("Profile updated successfully");
      })
      .catch((error) => {
        // // // console.error("Error updating user data:", error);
      });
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get<Order[]>("/api/order/getOrders");
        // // // console.log("Fetched orders:", response.data); // Add this line
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        // // console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const inProgressOrders = Array.isArray(orders)
    ? orders.filter(
        (order) => order.status === "pending" || order.status === "shipped"
      )
    : [];

  const deliveredOrders = Array.isArray(orders)
    ? orders.filter((order) => order.status === "delivered")
    : [];

  const returned = Array.isArray(orders)
    ? orders.filter((order) => order.status === "returned")
    : [];
  const cancel = Array.isArray(orders)
    ? orders.filter((order) => order.status === "canceled")
    : [];

  if (loading) {
    return (
      <div className=" w-full h-full flex justify-center items-center py-10">
        <RingLoader color="#FFCC4D" />
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <Breadcrumb className="cursor-pointer flex justify-between items-center py-3">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="text-white hover:text-white">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/user"
              className="text-white hover:text-white"
            >
              User
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <main className="flex text-white bg-black gap-5 justify-between py-5 md:py-10 flex-col lg:flex-row">
        <div className="flex-1 order-2 lg:order-1">
          <div>
            <h1 className="md:text-2xl font-bold">In Shipping</h1>
            {inProgressOrders.length > 0 ? (
              <div>
                {Array.isArray(inProgressOrders) &&
                  inProgressOrders
                    .toReversed()
                    .map((order) => <Order key={order._id} order={order} />)}
              </div>
            ) : (
              <div>No orders in progress.</div>
            )}
          </div>
          <div className="flex-1 py-5">
            <h1 className="md:text-2xl font-bold">Delivered</h1>
            {deliveredOrders.toReversed().length > 0 ? (
              <div>
                {Array.isArray(deliveredOrders) &&
                  deliveredOrders
                    .reverse()
                    .map((order) => <Order key={order._id} order={order} />)}
              </div>
            ) : (
              <div>No delivered orders.</div>
            )}
          </div>
          {returned.toReversed().length > 0 ? (
            <div className="flex-1 py-5">
              <h1 className="md:text-2xl font-bold">Returned Product</h1>
              <div>
                {Array.isArray(returned) &&
                  returned
                    .reverse()
                    .map((order) => <Order key={order._id} order={order} />)}
              </div>
            </div>
          ) : (
            <div></div>
          )}
          {cancel.toReversed().length > 0 ? (
            <div className="flex-1 py-5">
              <h1 className="md:text-2xl font-bold">Canceled Product</h1>
              <div>
                {Array.isArray(cancel) &&
                  cancel
                    .reverse()
                    .map((order) => <Order key={order._id} order={order} />)}
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
        <div className="border rounded-2xl p-3 h-fit md:order-1">
          <div className="flex justify-between p-4 items-center">
            <UserCircle className="" size={25} />

            <Sheet>
              <SheetTrigger>
                <Button variant="outline" className="bg-black p-2 text-xs">
                  Edit Profile
                </Button>
              </SheetTrigger>
              <SheetContent className="black white overflow-auto">
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name" className="">
                      Name
                    </Label>
                    <Input
                      id="name"
                      defaultValue={user?.name}
                      onChange={handleInputChange}
                      className="bg-black text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="username" className="">
                      Username
                    </Label>
                    <Input
                      id="username"
                      defaultValue={user?.username}
                      onChange={handleInputChange}
                      className="bg-black text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="phone" className="">
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      defaultValue={user?.phone}
                      onChange={handleInputChange}
                      className="bg-black text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="email" className="">
                      Email
                    </Label>
                    <Input
                      id="email"
                      defaultValue={user?.email}
                      onChange={handleInputChange}
                      className="bg-black text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="password" className="">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      onChange={handleInputChange}
                      className="bg-black text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="street" className="">
                      Address
                    </Label>
                    <Input
                      id="street"
                      placeholder="Street"
                      defaultValue={user?.address?.street}
                      onChange={handleInputChange}
                      className="bg-black text-white"
                    />
                    <Input
                      id="city"
                      placeholder="City"
                      defaultValue={user?.address?.city}
                      onChange={handleInputChange}
                      className="bg-black text-white"
                    />
                    <Input
                      id="state"
                      placeholder="State"
                      defaultValue={user?.address?.state}
                      onChange={handleInputChange}
                      className="bg-black text-white"
                    />
                    <Input
                      id="zip"
                      placeholder="ZIP"
                      defaultValue={user?.address?.zip}
                      onChange={handleInputChange}
                      className="bg-black text-white"
                    />
                    <Input
                      id="country"
                      placeholder="Country"
                      defaultValue={user?.address?.country}
                      onChange={handleInputChange}
                      className="bg-black text-white"
                    />
                  </div>
                  <Button type="submit">Save changes</Button>
                </form>
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex flex-col gap-3 border p-4 m-3 rounded-2xl">
            {user?.name && (
              <div>
                <div className="text-xs">Name</div>
                <div className=" text-sm">{user?.name}</div>
              </div>
            )}
            <div>
              <div className="text-xs">Username</div>
              <div className=" text-sm">{user?.username}</div>
            </div>
            <div>
              <div className="text-xs">Email</div>
              <div className=" text-sm">{user?.email}</div>
            </div>
            {user?.phone && (
              <div>
                <div className="text-xs">Phone</div>
                <div className=" text-sm">{user?.phone}</div>
              </div>
            )}
            {user?.address && (
              <div>
                <div className="text-xs">Address</div>
                <div className=" text-sm">{user?.address.street}</div>
                <div className=" text-sm">{user?.address.zip}</div>
                <div className=" text-sm">{user?.address.city}</div>
                <div className=" text-sm">{user?.address.state}</div>
                <div className=" text-sm">{user?.address.country}</div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

interface OrderProps {
  order: Order;
}

const Order: React.FC<OrderProps> = ({ order }) => {
  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="py-3">
      <div className=" text-xl">Ordered on {formattedDate}</div>
      <div className=" flex gap-2 py-1">
        <Badge variant="outline" className=" text-white">
          {order.status}
        </Badge>
        <Badge variant="outline" className=" text-white">
          {order.paymentMethod}
        </Badge>
      </div>
      <div className="grid md:grid-cols-2 gap-3 py-3 justify-between">
        {order.products.map((item: any) => (
          <Product key={item._id} item={item} />
        ))}
      </div>
      {/* Conditionally render ReturnRequest component */}
      {order.status === "delivered" && (
        <div>
          <ReturnRequest orderId={order._id} orderDate={order.createdAt} />
        </div>
      )}
      <div className=" text-sm">Ordered ID {order?._id}</div>
      <div className=" text-sm md:text-lg font-semibold">
        Total: ₹{order.total}{" "}
        {order.paymentMethod === "COD" && "(₹40 for Delivery)"}
      </div>
    </div>
  );
};

interface ProductProps {
  item: {
    product: {
      _id: string;
      name: string;
      images: string[]; // Updated to match the new structure
    };
    quantity: number;
    price: number;
    _id: string;
  };
}

const Product: React.FC<ProductProps> = ({ item }: ProductProps) => {
  const productImage = item.product ? item.product.images[0] : "";

  return (
    <Link href={`/products/${item.product?._id}`} className="flex gap-3">
      <Image
        src={productImage}
        alt={item.product?.name || ""}
        className="h-auto md:w-36 rounded-xl aspect-square w-28"
        width={100}
        height={100}
      />
      <div>
        <h3 className="text-sm md:text-xl py-2">{item.product?.name}</h3>
        <Image src={rating} alt="rating" className=" w-20 md:w-32" />
        <div className=" text-sm md:text-xl py-2">₹{item.price}</div>
        <div className="text-sm">Quantity: {item.quantity}</div>
      </div>
    </Link>
  );
};

export default UserProfile;
