//https://claude.ai/chat/bc0f9594-264d-4110-86de-4fe922b2aa8b
// Simulating a database of users and their orders
const database = {
    users: {
      1: { id: 1, name: 'Alice', email: 'alice@example.com' },
      2: { id: 2, name: 'Bob', email: 'bob@example.com' }
    },
    orders: {
      1: [
        { id: 101, userId: 1, product: 'Laptop', price: 1200 },
        { id: 102, userId: 1, product: 'Smartphone', price: 800 }
      ],
      2: [
        { id: 201, userId: 2, product: 'Tablet', price: 500 }
      ]
    },
    payments: {
      101: { orderId: 101, status: 'paid', date: '2025-03-10' },
      102: { orderId: 102, status: 'pending', date: '2025-03-15' },
      201: { orderId: 201, status: 'paid', date: '2025-03-12' }
    }
  };

  // Fetch user data with artificial delay
  function fetchUser(userId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = database.users[userId];
        if (user) {
          resolve(user);
        } else {
          reject(new Error(`User with ID ${userId} not found`));
        }
      }, 500);
    });
  }

  // Fetch orders for a user with artificial delay
  function fetchOrders(userId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const orders = database.orders[userId];
        if (orders) {
          resolve(orders);
        } else {
          reject(new Error(`No orders found for user ID ${userId}`));
        }
      }, 800);
    });
  }

  // Fetch payment details for an order with artificial delay
  function fetchPayment(orderId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const payment = database.payments[orderId];
        if (payment) {
          resolve(payment);
        } else {
          reject(new Error(`No payment found for order ID ${orderId}`));
        }
      }, 600);
    });
  }

  // Higher-level function to get all payment statuses for a user
  function getUserPaymentStatuses(userId) {
    // First, fetch the user to verify they exist
    return fetchUser(userId)
      .then(user => {
        console.log(`Found user: ${user.name}`);
        // Then fetch their orders
        return fetchOrders(userId).then(orders => {
          console.log(`Found ${orders.length} orders for ${user.name}`);
          // Create an array of promises for each order's payment
          const paymentPromises = orders.map(order => {
            return fetchPayment(order.id)
              .then(payment => {
                // Combine order and payment data
                return {
                  orderId: order.id,
                  product: order.product,
                  price: order.price,
                  paymentStatus: payment.status,
                  paymentDate: payment.date
                };
              })
              .catch(error => {
                // Handle case where payment info is missing
                return {
                  orderId: order.id,
                  product: order.product,
                  price: order.price,
                  paymentStatus: 'unknown',
                  paymentDate: null,
                  error: error.message
                };
              });
          });

          // Wait for all payment promises to resolve
          return Promise.all(paymentPromises);
        });
      })
      .then(orderPayments => {
        // Calculate some summary statistics
        const totalSpent = orderPayments.reduce((sum, item) => {
          return item.paymentStatus === 'paid' ? sum + item.price : sum;
        }, 0);

        const pendingAmount = orderPayments.reduce((sum, item) => {
          return item.paymentStatus === 'pending' ? sum + item.price : sum;
        }, 0);

        // Return the final comprehensive report
        return {
          userId,
          userName: database.users[userId].name,
          orderPayments,
          summary: {
            totalOrders: orderPayments.length,
            totalSpent,
            pendingAmount,
            paidOrders: orderPayments.filter(item => item.paymentStatus === 'paid').length
          }
        };
      });
  }

  // Implementation using async/await for comparison
  async function getUserPaymentStatusesAsync(userId) {
    try {
      // Fetch user
      const user = await fetchUser(userId);
      console.log(`Found user: ${user.name}`);

      // Fetch orders
      const orders = await fetchOrders(userId);
      console.log(`Found ${orders.length} orders for ${user.name}`);

      // Process each order's payment in parallel
      const orderPayments = await Promise.all(
        orders.map(async (order) => {
          try {
            const payment = await fetchPayment(order.id);
            return {
              orderId: order.id,
              product: order.product,
              price: order.price,
              paymentStatus: payment.status,
              paymentDate: payment.date
            };
          } catch (error) {
            return {
              orderId: order.id,
              product: order.product,
              price: order.price,
              paymentStatus: 'unknown',
              paymentDate: null,
              error: error.message
            };
          }
        })
      );

      // Calculate summary statistics
      const totalSpent = orderPayments.reduce((sum, item) => {
        return item.paymentStatus === 'paid' ? sum + item.price : sum;
      }, 0);

      const pendingAmount = orderPayments.reduce((sum, item) => {
        return item.paymentStatus === 'pending' ? sum + item.price : sum;
      }, 0);

      // Return comprehensive report
      return {
        userId,
        userName: user.name,
        orderPayments,
        summary: {
          totalOrders: orderPayments.length,
          totalSpent,
          pendingAmount,
          paidOrders: orderPayments.filter(item => item.paymentStatus === 'paid').length
        }
      };
    } catch (error) {
      throw new Error(`Failed to get payment statuses: ${error.message}`);
    }
  }

  // Execution and error handling
  function runExample() {
    // Using promise chains
    getUserPaymentStatuses(1)
      .then(report => {
        console.log('Promise Chain Result:');
        console.log(JSON.stringify(report, null, 2));
      })
      .catch(error => {
        console.error('Error in promise chain:', error.message);
      });

    // Using async/await
    (async () => {
      try {
        const report = await getUserPaymentStatusesAsync(1);
        console.log('Async/Await Result:');
        console.log(JSON.stringify(report, null, 2));
      } catch (error) {
        console.error('Error in async/await:', error.message);
      }
    })();

    // Error case
    getUserPaymentStatuses(3)
      .then(report => {
        console.log(report);
      })
      .catch(error => {
        console.error('Expected error for non-existent user:', error.message);
      });
  }

  // Run the example
  runExample();