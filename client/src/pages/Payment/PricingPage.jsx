import * as React from 'react';
import { getAuth } from 'firebase/auth';

function PricingPage() {
  // Get the current user's UID
  const auth = getAuth();
  const user = auth.currentUser;
  const uid = user ? user.uid : '';

  return (
    <stripe-pricing-table
      pricing-table-id="prctbl_1NxvPzF4O3GGcqFnpK5pbUVL"
      publishable-key="pk_test_51NpIJeF4O3GGcqFncHga14QeVKc0s8KqDrRgkExVAbv94IQVGKaO1LlA4SNHUexlmh40EEaxHsfsYa6FU31XuqWY00ckJYoQxd"
      client-reference-id={uid} // Set the user's UID as client-reference-id
    ></stripe-pricing-table>
  );
}

export default PricingPage;
