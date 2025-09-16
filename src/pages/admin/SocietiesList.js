import React, { useEffect, useState } from "react";
import axios from "../../axios";  // ✅ your axios instance
import AdminLayout from "../../components/AdminLayout";

export default function SocietiesList() {
    const [societies, setSocieties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSocieties = async () => {
            try {
                const res = await axios.get("/admin/societies"); // Laravel endpoint
                setSocieties(res.data);
            } catch (err) {
                console.error("Error fetching societies:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSocieties();
    }, []);

    return (
        <AdminLayout activePage="societies">
            <div className="p-3">
                <h2>Societies Management</h2>

                {loading ? (
                    <p>Loading societies…</p>
                ) : societies.length === 0 ? (
                    <p>No societies found.</p>
                ) : (
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Logo</th>
                                <th>Name</th>
                                <th>Slug</th>
                                <th>Join Link</th>
                                <th>Description</th>   {/* ✅ NEW column */}
                            </tr>
                        </thead>
                        <tbody>
                            {societies.map((s) => (
                                <tr key={s.id}>
                                    <td>{s.id}</td>
                                    <td>
                                        {s.logo_url ? (
                                            <img
                                                src={s.logo_url}
                                                alt={s.name}
                                                style={{ width: 40, height: 40, objectFit: "contain" }}
                                            />
                                        ) : (
                                            "—"
                                        )}
                                    </td>
                                    <td>{s.name}</td>
                                    <td>{s.slug}</td>
                                    <td>
                                        {s.join_link ? (
                                            <a href={s.join_link} target="_blank" rel="noreferrer">
                                                Link
                                            </a>
                                        ) : (
                                            "—"
                                        )}
                                    </td>
                                    <td>{s.description || "—"}</td>  {/* ✅ NEW column */}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                )}
            </div>
        </AdminLayout>
    );
}
