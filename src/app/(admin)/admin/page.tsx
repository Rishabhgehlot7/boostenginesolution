"use client";
import { useRouter } from "next/navigation";
import React, { cache, Suspense, useEffect, useState } from "react";
import { RingLoader } from "react-spinners";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface IUser {
  _id: string;
  username: string;
  name: string;
  email: string;
  phone: number;
  role: "customer" | "admin";
  createdAt: Date;
}

interface IOrder {
  _id: string;
  user: {
    _id: string;
    username: string;
    name: string;
    email: string;
  };
  products: {
    product: string;
    quantity: number;
    price: number;
  }[];
  status: "pending" | "shipped" | "delivered" | "canceled" | "returned";
  total: number;
  createdAt: Date;
}

interface IProduct {
  _id: string;
  name: string;
  category: string;
  subcategory?: string;
  stock: {
    id: string;
    stock: number;
    color: string;
    price: number;
    size: string;
  }[];
  createdAt: Date;
}
const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<any[]>([]);
  const [orderStatsData, setOrderStatsData] = useState<any[]>([]);
  const [productPerformanceData, setProductPerformanceData] = useState<any[]>(
    []
  );
  const [recentSales, setRecentSales] = useState<any[]>([]);
  const [revenue, setRevenue] = useState<number>(0);
  const [subscriptions, setSubscriptions] = useState<number>(0);
  const [sales, setSales] = useState<number>(0);
  const [productCount, setProductCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const fetchData = cache(async () => {
      router.refresh();
      try {
        // Fetching Users
        const userResponse = await fetch("/api/admin/viewAllUsers", {
          next: {
            revalidate: 5,
          },
          cache: "no-store",
        });
        const userData1 = await userResponse.json();

        setUsers(userData1);
        console.log(userData1);

        // Fetching Orders
        const orderResponse = await fetch("/api/order/orders", {
          next: {
            revalidate: 5,
          },
          cache: "no-store",
        });
        const orderData1 = await orderResponse.json();
        setOrders(orderData1);
        console.log(orderData1);

        // Fetching Products
        const productResponse = await fetch("/api/products", {
          cache: "no-cache",
        });
        const productData1 = await productResponse.json();
        setProducts(productData1);
        setProductCount(productData1.length); // Update product count
        // Process User Growth Data
        const userData = userData1.reduce((acc: any, user: IUser) => {
          const month = new Date(user.createdAt).toLocaleString("default", {
            month: "short",
          });
          if (!acc[month]) acc[month] = { month, users: 0 };
          acc[month].users += 1;
          return acc;
        }, {});
        setUserGrowthData(Object.values(userData));
        // Process Order Statistics Data
        const orderData = orderData1.reduce((acc: any, order: IOrder) => {
          const month = new Date(order.createdAt).toLocaleString("default", {
            month: "short",
          });
          if (!acc[month]) acc[month] = { month, orders: 0 };
          acc[month].orders += 1;
          return acc;
        }, {});

        setOrderStatsData(Object.values(orderData));
        // Process Product Performance Data for Top Ordered Products
        const productOrderMap = new Map<string, number>();
        orderData1.forEach((order: IOrder) => {
          order.products.forEach((orderedProduct) => {
            const currentQuantity =
              productOrderMap.get(orderedProduct.product) || 0;
            productOrderMap.set(
              orderedProduct.product,
              currentQuantity + orderedProduct.quantity
            );
          });
        });
        // Process Product Performance Data
        const productData = Array.from(
          productOrderMap,
          ([name, sales]: any) => ({
            name: name.name,
            sales,
          })
        )
          .sort((a, b) => b.sales - a.sales)
          .slice(0, 3); // Get top 5 products

        setProductPerformanceData(productData);
        console.log(productData);

        // Process Recent Sales
        const recentSalesData = orderData1.map((order: IOrder) => {
          const user = userData1.find(
            (user: IUser) => user._id === order.user._id
          );
          return {
            user: user?.name,
            email: user?.email,
            total: order.total,
          };
        });
        setRecentSales(recentSalesData);
        // Calculate Total Revenue
        const totalRevenue = orderData1
          .filter(
            (order: IOrder) =>
              order?.status !== "canceled" && order?.status !== "returned"
          )
          .reduce((acc: any, order: any) => acc + order.total, 0);
        setRevenue(totalRevenue);

        // Calculate Subscriptions
        const totalSubscriptions = userData1.length;
        setSubscriptions(totalSubscriptions);
        // Calculate Sales
        const totalSales = orderData1.length;
        setSales(totalSales);
        setLoading(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    });

    fetchData();
  }, []);

  if (!loading) {
    return (
      <div className=" w-full h-full flex justify-center items-center py-10">
        <RingLoader color="#FFCC4D" />
      </div>
    );
  }

  return (
    <Suspense>
      <div className="p-4 text-white w-full bg-gray-950">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="bg-black p-4 border rounded-lg">
            <h2 className="text-xl font-bold mb-2">Total Revenue</h2>
            <p className="text-2xl font-bold">₹{revenue.toFixed(2)}</p>
            <p className="text-green-500">+20.1% from last month</p>
          </div>
          <div className="bg-black p-4 border border-gray-700 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Users</h2>
            <p className="text-2xl font-bold">+{subscriptions}</p>
            <p className="text-green-500">+180.1% from last month</p>
          </div>
          <div className="bg-black p-4 border border-gray-700 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Sales</h2>
            <p className="text-2xl font-bold">+{sales}</p>
            <p className="text-green-500">+19% from last month</p>
          </div>
          <div className="bg-black p-4 border border-gray-700 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Product Count</h2>
            <p className="text-2xl font-bold">{productCount}</p>
            <p className="text-green-500">Total products</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black p-4 border border-gray-700 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Bar dataKey="users" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-black p-4 border border-gray-700 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Recent Sales</h2>
            <div>
              {recentSales.slice(0, 5).map((sale, index) => (
                <div
                  key={index}
                  className="flex justify-between py-2 border-b border-gray-700"
                >
                  <div>
                    <p className="font-bold">{sale.user}</p>
                    <p className="text-sm text-gray-400">{sale.email}</p>
                  </div>
                  <p className="text-green-500 font-bold">
                    +₹{sale.total.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-black p-4 border border-gray-700 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Orders</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={orderStatsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Bar dataKey="orders" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-black p-4 border border-gray-700 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Product Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Bar dataKey="sales" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-black p-4 border border-gray-700 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Products by Category</h2>
            {/* Example: Display product data */}
            <ul className="divide-y divide-gray-700">
              {products.map((product, index) => (
                <li key={index} className="py-2">
                  <span className="font-bold">{product.category}</span>:{" "}
                  {product.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default Dashboard;
