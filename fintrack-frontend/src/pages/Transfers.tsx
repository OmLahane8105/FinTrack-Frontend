import axios from "axios";
import { useEffect, useState } from "react";

import api from "../api/api";

import type {
  Account,
  Transfer,
  TransferRequest,
} from "../types";

export default function Transfers() {

  const [accounts, setAccounts] =
    useState<Account[]>([]);

  const [transfers, setTransfers] =
    useState<Transfer[]>([]);

  const [fromAccountId, setFromAccountId] =
    useState("");

  const [toAccountId, setToAccountId] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [transferDate, setTransferDate] =
    useState(
      new Date()
        .toISOString()
        .split("T")[0]
    );

  const [description, setDescription] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const fetchData = async () => {
    try {
      const [
        accountsResponse,
        transfersResponse,
      ] = await Promise.all([
        api.get<Account[]>(
          "/api/accounts"
        ),

        api.get<Transfer[]>(
          "/api/transfers"
        ),
      ]);

      setAccounts(
        accountsResponse.data
      );

      setTransfers(
        transfersResponse.data
      );
    } catch (error: unknown) {
      console.error(error);

      const message =
        axios.isAxiosError(error)
          ? error.response?.data?.message
          : undefined;

      setError(
        message ||
        "Unable to load transfers"
      );
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          accountsResponse,
          transfersResponse,
        ] = await Promise.all([
          api.get<Account[]>(
            "/api/accounts"
          ),

          api.get<Transfer[]>(
            "/api/transfers"
          ),
        ]);

        if (!cancelled) {
          setAccounts(
            accountsResponse.data
          );

          setTransfers(
            transfersResponse.data
          );
        }
      } catch (error: unknown) {
        console.error(error);

        const message =
          axios.isAxiosError(error)
            ? error.response?.data?.message
            : undefined;

        if (!cancelled) {
          setError(
            message ||
            "Unable to load transfers"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadInitialData();

    return () => {
      cancelled = true;
    };
  }, []);

  const resetForm = () => {

    setFromAccountId("");
    setToAccountId("");
    setAmount("");
    setDescription("");

    setTransferDate(
      new Date()
        .toISOString()
        .split("T")[0]
    );
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    setError("");

    if (!fromAccountId) {
      setError("Select source account");
      return;
    }

    if (!toAccountId) {
      setError("Select destination account");
      return;
    }

    if (
      fromAccountId === toAccountId
    ) {
      setError(
        "Source and destination accounts must be different"
      );
      return;
    }

    const amountNumber =
      Number(amount);

    if (
      !amount ||
      Number.isNaN(amountNumber) ||
      amountNumber <= 0
    ) {

      setError(
        "Enter a valid transfer amount"
      );

      return;
    }

    const request: TransferRequest = {

      fromAccountId:
        Number(fromAccountId),

      toAccountId:
        Number(toAccountId),

      amount: amountNumber,

      transferDate,

      description:
        description.trim(),
    };

    try {

      setSaving(true);

      await api.post(
        "/api/transfers",
        request
      );

      resetForm();

      await fetchData();

    } catch (error: unknown) {

      console.error(error);

      const message =
        axios.isAxiosError(error)
          ? error.response?.data?.message
          : undefined;

      setError(
        message ||
        "Unable to create transfer"
      );

    } finally {

      setSaving(false);
    }
  };

  const handleDelete = async (
    id: number
  ) => {

    const confirmed =
      window.confirm(
        "Delete this transfer and reverse its account balances?"
      );

    if (!confirmed) {
      return;
    }

    try {

      setError("");

      await api.delete(
        `/api/transfers/${id}`
      );

      await fetchData();

    } catch (error: unknown) {

      console.error(error);

      const message =
        axios.isAxiosError(error)
          ? error.response?.data?.message
          : undefined;

      setError(
        message ||
        "Unable to delete transfer"
      );
    }
  };

  if (loading) {

    return (
      <main className="container">
        <p>Loading transfers...</p>
      </main>
    );
  }

  return (
    <main className="container">

      <div className="page-header">

        <div>
          <h1>Transfers</h1>

          <p>
            Move money between your FinTrack accounts.
          </p>
        </div>

      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="form-card">

        <h2>Create Transfer</h2>

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>
              From Account
            </label>

            <select
              value={fromAccountId}
              onChange={(e) =>
                setFromAccountId(
                  e.target.value
                )
              }
            >

              <option value="">
                Select account
              </option>

              {accounts.map(account => (

                <option
                  key={account.id}
                  value={account.id}
                >
                  {account.name} — ₹
                  {Number(
                    account.balance
                  ).toLocaleString("en-IN")}
                </option>

              ))}

            </select>

          </div>


          <div className="form-group">

            <label>
              To Account
            </label>

            <select
              value={toAccountId}
              onChange={(e) =>
                setToAccountId(
                  e.target.value
                )
              }
            >

              <option value="">
                Select account
              </option>

              {accounts.map(account => (

                <option
                  key={account.id}
                  value={account.id}
                >
                  {account.name}
                </option>

              ))}

            </select>

          </div>


          <div className="form-group">

            <label>
              Amount
            </label>

            <input
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
              placeholder="10000"
            />

          </div>


          <div className="form-group">

            <label>
              Transfer Date
            </label>

            <input
              type="date"
              value={transferDate}
              onChange={(e) =>
                setTransferDate(
                  e.target.value
                )
              }
            />

          </div>


          <div className="form-group">

            <label>
              Description
            </label>

            <input
              type="text"
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="Monthly savings transfer"
            />

          </div>


          <button
            type="submit"
            disabled={saving}
          >
            {saving
              ? "Transferring..."
              : "Transfer Money"}
          </button>

        </form>

      </div>


      <div className="section">

        <h2>Transfer History</h2>

        {transfers.length === 0 ? (

          <p>
            No transfers yet.
          </p>

        ) : (

          <div className="table-container">

            <table>

              <thead>

                <tr>

                  <th>Date</th>

                  <th>From</th>

                  <th>To</th>

                  <th>Amount</th>

                  <th>Description</th>

                  <th>Action</th>

                </tr>

              </thead>

              <tbody>

                {transfers.map(
                  transfer => (

                    <tr
                      key={transfer.id}
                    >

                      <td>
                        {transfer.transferDate}
                      </td>

                      <td>
                        {transfer.fromAccountName}
                      </td>

                      <td>
                        {transfer.toAccountName}
                      </td>

                      <td>
                        ₹
                        {Number(
                          transfer.amount
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      <td>
                        {transfer.description ||
                          "—"}
                      </td>

                      <td>

                        <button
                          className="delete-button"
                          onClick={() =>
                            handleDelete(
                              transfer.id
                            )
                          }
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </main>
  );
}