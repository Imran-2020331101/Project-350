import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Free',
    price: '৳0',
    features: [
      'Create 1 Trip',
      'Limited Blog Access',
      'Basic Support',
    ],
    buttonLabel: 'Current Plan',
    buttonDisabled: true,
  },
  {
    name: 'Monthly',
    price: '৳299 / month',
    features: [
      'Unlimited Trips',
      'Full Blog Access',
      'Priority Support',
      'AI Assistant Access',
    ],
    buttonLabel: 'Upgrade',
    buttonDisabled: false,
  },
  {
    name: 'Yearly',
    price: '৳1999 / year',
    features: [
      'Everything in Monthly',
      '2 Months Free',
      'Early Feature Access',
    ],
    buttonLabel: 'Upgrade',
    buttonDisabled: false,
  },
];

const SubscriptionPlans = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-gray-400 mb-12">Upgrade to unlock full access and more features</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-xl shadow-lg p-6 ${
                plan.name === 'Monthly'
                  ? 'bg-blue-900 border-4 border-blue-800'
                  : 'bg-gray-800'
              }`}
            >
              <h2 className="text-2xl font-semibold mb-4">{plan.name}</h2>
              <p className="text-3xl font-bold mb-6">{plan.price}</p>
              <ul className="mb-6 space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center justify-start">
                    <CheckCircle2 className="text-green-400 mr-2" size={20} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                disabled={plan.buttonDisabled}
                className={`w-full py-2 rounded-lg text-white font-semibold transition ${
                  plan.buttonDisabled
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {plan.buttonDisabled ? (
                  plan.buttonLabel
                ) : (
                  <Link to="/upgrade/checkout">{plan.buttonLabel}</Link>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
