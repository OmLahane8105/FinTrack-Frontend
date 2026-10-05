import axios from "axios";
import { useEffect, useState } from "react";

import api from "../api/api";
import type { Category, CategoryRequest } from "../types";

export default function Categories() {

  // =========================
  // STATE
  // =========================

  const [categories, setCategories] = useState<Category[]>([]);

  const [name, setName] = useState("");

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");


  // =========================
  // LOAD CATEGORIES
  // =========================

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get<Category[]>("/api/categories");

      setCategories(response.data);

    } catch (error: unknown) {
      console.error(error);

      const message =
        axios.isAxiosError(error)
          ? error.response?.data?.message
          : undefined;

      setError(
        message || "Unable to load categories"
      );

    } finally {
      setLoading(false);
    }
  };


  // Load categories when page opens
  useEffect(() => {
    let cancelled = false;

    const loadCategories = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await api.get<Category[]>("/api/categories");

        if (!cancelled) {
          setCategories(response.data);
        }
      } catch (error: unknown) {
        console.error(error);

        if (!cancelled) {
          const message =
            axios.isAxiosError(error)
              ? error.response?.data?.message
              : undefined;

          setError(
            message || "Unable to load categories"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);


  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {

    setName("");

    setEditingId(null);

    setError("");
  };


  // =========================
  // EDIT
  // =========================

  const handleEdit = (category: Category) => {

    setEditingId(category.id);

    setName(category.name);

    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Category name is required");
      return;
    }

    const request: CategoryRequest = {
      name: name.trim(),
    };

    try {

      setSaving(true);

      if (editingId === null) {

        // CREATE
        await api.post(
          "/api/categories",
          request
        );

      } else {

        // UPDATE
        await api.put(
          `/api/categories/${editingId}`,
          request
        );
      }

      resetForm();

      await fetchCategories();

    } catch (error: unknown) {

      console.error(error);

      const message =
        axios.isAxiosError(error)
          ? error.response?.data?.message
          : undefined;

      setError(
        message ||
          (editingId === null
            ? "Unable to create category"
            : "Unable to update category")
      );

    } finally {

      setSaving(false);
    }
  };


  // =========================
  // DELETE
  // =========================

  const handleDelete = async (
    id: number
  ) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) {
      return;
    }

    try {

      setError("");

      await api.delete(
        `/api/categories/${id}`
      );

      await fetchCategories();

    } catch (error: unknown) {

      console.error(error);

      const message =
        axios.isAxiosError(error)
          ? error.response?.data?.message
          : undefined;

      setError(
        message || "Unable to delete category"
      );
    }
  };



  // =========================
  // JSX
  // =========================

  return (
    <>
      <main className="container">

        <div className="page-header">

          <div>

            <h1>Categories</h1>

            <p>
              Manage your income and expense
              categories.
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
            CATEGORY FORM
        ========================= */}

        <div className="form-card">

          <h2>
            {editingId === null
              ? "Add Category"
              : "Edit Category"}
          </h2>


          <form onSubmit={handleSubmit}>

            <div className="form-row category-form-row">

              <div className="form-group">

                <label>
                  Category Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Example: Food"
                />

              </div>

            </div>


            <div className="form-actions">

              <button
                type="submit"
                className="primary-button form-button"
                disabled={saving}
              >

                {saving
                  ? "Saving..."
                  : editingId === null
                    ? "Add Category"
                    : "Update Category"}

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
            CATEGORY LIST
        ========================= */}

        <div className="categories-section">

          <h2>
            Your Categories
          </h2>


          {loading ? (

            <p>
              Loading categories...
            </p>

          ) : categories.length === 0 ? (

            <div className="empty-state">

              <h3>
                No categories yet
              </h3>

              <p>
                Add your first category above.
              </p>

            </div>

          ) : (

            <div className="categories-list">

              {categories.map((category) => (

                <div
                  className="category-item"
                  key={category.id}
                >

                  <div className="category-info">

                    <div className="category-icon">
                      {category.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <span>
                      {category.name}
                    </span>

                  </div>


                  <div className="category-actions">

                    <button
                      className="edit-button"
                      onClick={() =>
                        handleEdit(category)
                      }
                    >
                      Edit
                    </button>


                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDelete(category.id)
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