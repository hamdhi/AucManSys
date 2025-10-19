import React from 'react';

const MetricCard = ({ title, value }) => (
  <div className="rounded-lg bg-white p-6 text-center shadow-lg">
    <h4 className="text-xl font-semibold text-gray-700">{title}</h4>
    <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
  </div>
);

function DashboardMetrics({ users, products, bids }) {
  const totalUsers = users.length;
  const totalProducts = products.length;
  const totalBids = bids.length;

  const usersByRole = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  const productsByCategory = products.reduce((acc, product) => {
    acc[product.categoryName] = (acc[product.categoryName] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="border-t border-gray-200 pt-8">
      <h3 className="mb-4 text-lg font-semibold text-gray-700">Analytics Dashboard</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard title="Total Users" value={totalUsers} />
        <MetricCard title="Total Products" value={totalProducts} />
        <MetricCard title="Total Bids" value={totalBids} />
      </div>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h4 className="text-xl font-semibold text-gray-700">Users by Role</h4>
          <ul>
            {Object.entries(usersByRole).map(([role, count]) => (
              <li key={role} className="mt-2 flex justify-between">
                <span>{role}</span>
                <span className="font-semibold">{count}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h4 className="text-xl font-semibold text-gray-700">Products by Category</h4>
          <ul>
            {Object.entries(productsByCategory).map(([category, count]) => (
              <li key={category} className="mt-2 flex justify-between">
                <span>{category}</span>
                <span className="font-semibold">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DashboardMetrics;