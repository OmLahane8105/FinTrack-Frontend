import axios from "axios";
import { useEffect, useState } from "react";

import api from "../api/api";
import type {
  Account,
  AccountRequest,
  AccountType,
} from "../types";

const accountTypes: AccountType[] = [
  "BANK",
  "CASH",
  "SAVINGS",
  "CREDIT_CARD",
  "WALLET",
];

export default function Accounts() {

  // =========================
  // STATE
  // =========================

  const [accounts, setAccounts] = useState<Account[]>([]);

  const [name, setName] = useState("");
  const [type, setType] = useState<AccountType>("BANK");
  const [balance, setBalance] = useState("");

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");


  // =========================
  // LOAD ACCOUNTS
  // =========================

  const fetchAccounts = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await api.get("/api/accounts");

      setAccounts(response.data);

    } catch (error: unknown) {
      console.error(error);

      const message =
        axios.isAxiosError(error)
          ? error.response?.data?.message
          : undefined;

      setError(
        message || "Unable to load accounts"
      );
    }finally {

      setLoading(false);

    }
  };


  // Load accounts when page opens
  useEffect(() => {
    let cancelled = false;

    const loadAccounts = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await api.get<Account[]>("/api/accounts");

        if (!cancelled) {
          setAccounts(response.data);
        }
      } catch (error: unknown) {
        console.error(error);

        if (!cancelled) {
          const message =
            axios.isAxiosError(error)
              ? error.response?.data?.message
              : undefined;

          setError(
            message || "Unable to load accounts"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadAccounts();

    return () => {
      cancelled = true;
    };
  }, []);


  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {

    setName("");
    setType("BANK");
    setBalance("");

    setEditingId(null);

    setError("");
  };


  // =========================
  // EDIT ACCOUNT
  // =========================

  const handleEdit = (account: Account) => {

    setEditingId(account.id);

    setName(account.name);

    setType(account.type);

    setBalance(String(account.balance));

    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  // =========================
  // SUBMIT FORM
  // =========================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    setError("");


    // Basic validation

    if (!name.trim()) {
      setError("Account name is required");
      return;
    }


    if (balance === "") {
      setError("Balance is required");
      return;
    }


    const balanceNumber = Number(balance);


    if (Number.isNaN(balanceNumber)) {
      setError("Balance must be a valid number");
      return;
    }


    if (balanceNumber < 0) {
      setError("Balance cannot be negative");
      return;
    }


    const request: AccountRequest = {
      name: name.trim(),
      type,
      balance: balanceNumber,
    };


    try {

      setSaving(true);


      if (editingId === null) {

        // CREATE

        await api.post(
          "/api/accounts",
          request
        );

      } else {

        // UPDATE

        await api.put(
          `/api/accounts/${editingId}`,
          request
        );

      }


      resetForm();

      await fetchAccounts();

    }  catch (error: unknown) {
        console.error(error);

        const message =
          axios.isAxiosError(error)
            ? error.response?.data?.message
            : undefined;

        setError(
          message ||
            (editingId === null
              ? "Unable to create account"
              : "Unable to update account")
        );
      }
  };


  // =========================
  // DELETE ACCOUNT
  // =========================

  const handleDelete = async (id: number) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this account?"
    );

    if (!confirmed) {
      return;
    }


    try {

      setError("");

      await api.delete(
        `/api/accounts/${id}`
      );

      await fetchAccounts();

    } catch (error: unknown) {
        console.error(error);

        const message =
          axios.isAxiosError(error)
            ? error.response?.data?.message
            : undefined;

        setError(
          message || "Unable to delete account"
        );
      }
  };


  // =========================
  // FORMAT ACCOUNT TYPE
  // =========================

  const formatAccountType = (
    accountType: AccountType
  ) => {

    return accountType
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };


  // =========================
  // JSX
  // =========================

  return (
    <>

      <main className="container">

        <div className="page-header">

          <div>

            <h1>Accounts</h1>

            <p>
              Manage your bank accounts, cash,
              savings and wallets.
            </p>

          </div>

        </div>


        {/* ERROR */}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        {/* =========================
            ACCOUNT FORM
        ========================= */}

        <div className="form-card">

          <h2>
            {editingId === null
              ? "Add Account"
              : "Edit Account"}
          </h2>


          <form onSubmit={handleSubmit}>

            <div className="form-row">


              {/* NAME */}

              <div className="form-group">

                <label>
                  Account Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Example: HDFC Bank"
                />

              </div>


              {/* TYPE */}

              <div className="form-group">

                <label>
                  Account Type
                </label>

                <select
                  value={type}
                  onChange={(e) =>
                    setType(
                      e.target.value as AccountType
                    )
                  }
                >

                  {accountTypes.map(
                    (accountType) => (

                      <option
                        key={accountType}
                        value={accountType}
                      >
                        {formatAccountType(
                          accountType
                        )}
                      </option>

                    )
                  )}

                </select>

              </div>


              {/* BALANCE */}

              <div className="form-group">

                <label>
                  Balance
                </label>

                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={balance}
                  onChange={(e) =>
                    setBalance(e.target.value)
                  }
                  placeholder="0.00"
                />

              </div>

            </div>


            {/* BUTTONS */}

            <div className="form-actions">

              <button
                type="submit"
                className="primary-button form-button"
                disabled={saving}
              >

                {saving
                  ? "Saving..."
                  : editingId === null
                    ? "Add Account"
                    : "Update Account"}

              </button>


              {editingId !== null && (

                <button
                  type="button"
                  className="secondary-button"
                  onClick={resetForm}
                >
                  Cancel
                </button>

              )}

            </div>

          </form>

        </div>


        {/* =========================
            ACCOUNT LIST
        ========================= */}

        <div className="accounts-section">

          <h2>
            Your Accounts
          </h2>


          {loading ? (

            <p>
              Loading accounts...
            </p>

          ) : accounts.length === 0 ? (

            <div className="empty-state">

              <h3>
                No accounts yet
              </h3>

              <p>
                Add your first account above.
              </p>

            </div>

          ) : (

            <div className="accounts-grid">

              {accounts.map((account) => (

                <div
                  className="account-card"
                  key={account.id}
                >

                  <div className="account-card-header">

                    <div>

                      <h3>
                        {account.name}
                      </h3>

                      <span className="account-type">
                        {formatAccountType(
                          account.type
                        )}
                      </span>

                    </div>

                  </div>


                  <div className="account-balance">

                    <span>
                      Balance
                    </span>

                    <strong>
                      ₹{Number(account.balance).toFixed(2)}
                    </strong>

                  </div>


                  <div className="account-actions">

                    <button
                      className="edit-button"
                      onClick={() =>
                        handleEdit(account)
                      }
                    >
                      Edit
                    </button>


                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDelete(account.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </main>
    </>
  );
}