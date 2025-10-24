import React, { useEffect, useState } from "react";
import {
  Mail,
  Send,
  Eye,
  MousePointer,
  AlertCircle,
  Clock,
  Trash2,
} from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

export default function PhishingEmailDashboard() {
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axios.get("https://localhost:7017/sent-emails");
        const formattedEmails = response.data.map((email, index) => ({
          id: index + 1,
          email: email,
          message: "Instagram təhlükəsizlik yeniləməsi.",
          sentAt: new Date().toLocaleString("az-AZ"),
          status: "sent",
          openedAt: null,
          clickedAt: null,
        }));
        setEmails(formattedEmails);
      } catch (error) {
        console.error("Xəta baş verdi:", error);
      }
    };

    fetchEmails();
  }, []);

  const [formData, setFormData] = useState({
    email: "",
  });

  const [showForm, setShowForm] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.email) {
      const newEmail = {
        toEmail: formData.email,
      };
      const request = axios.post("https://localhost:7017/send", newEmail);
      request
        .then((response) => {
          // console.log("Email göndərildi:", response.data);
          Swal.fire({
            title: "Uğurlu!",
            text: "Emailə göndərildi!",
            icon: "success",
            preConfirm: () => {
              setFormData({ email: "" }); // <- bu hissəni düzəltdim
            },
          });
        })
        .catch((error) => {
          console.log(error);
          Swal.fire({
            title: "Xəta",
            text: "Xəta baş verdi!",
            icon: "error",
          });
        });
    }
  };

  const handleDelete = (id) => {
    setEmails((prev) => prev.filter((email) => email.id !== id));
  };

  const simulateOpen = (id) => {
    setEmails((prev) =>
      prev.map((email) => {
        if (email.id === id && email.status === "sent") {
          return {
            ...email,
            status: "opened",
            openedAt: new Date().toLocaleString("az-AZ", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
        }
        return email;
      })
    );
  };

  const simulateClick = (id) => {
    setEmails((prev) =>
      prev.map((email) => {
        if (
          email.id === id &&
          (email.status === "opened" || email.status === "sent")
        ) {
          return {
            ...email,
            status: "clicked",
            clickedAt: new Date().toLocaleString("az-AZ", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            }),
            openedAt:
              email.openedAt ||
              new Date().toLocaleString("az-AZ", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              }),
          };
        }
        return email;
      })
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "sent":
        return {
          text: "Göndərilib",
          class: "bg-blue-100 text-blue-700",
          icon: Clock,
        };
      case "opened":
        return {
          text: "Açılıb",
          class: "bg-yellow-100 text-yellow-700",
          icon: Eye,
        };
      case "clicked":
        return {
          text: "Klik Edilib",
          class: "bg-red-100 text-red-700",
          icon: MousePointer,
        };
      default:
        return {
          text: "Naməlum",
          class: "bg-gray-100 text-gray-700",
          icon: AlertCircle,
        };
    }
  };

  const stats = {
    total: emails.length,
    sent: emails.filter((e) => e.status === "sent").length,
    opened: emails.filter((e) => e.status === "opened").length,
    clicked: emails.filter((e) => e.status === "clicked").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Phishing Email Göndərmə Sistemi
                </h1>
                <p className="text-sm text-gray-500">
                  Email göndər və nəticələri izlə
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Yeni Email Göndər</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Ümumi</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <Mail className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Göndərilib</p>
                <p className="text-3xl font-bold text-blue-600">{stats.sent}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Açılıb</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {stats.opened}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Eye className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Klik Edilib</p>
                <p className="text-3xl font-bold text-red-600">
                  {stats.clicked}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <MousePointer className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Yeni Phishing Email Göndər
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Ünvanı
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="meselen: user@company.az"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phishing Mesajı
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Phishing email mətni..."
                  required
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div> */}

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Göndər</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Ləğv et
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Göndərilmiş Emaillər
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mesaj
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Göndərilmə Tarixi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Əməliyyatlar
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {emails.map((email) => {
                  const statusInfo = getStatusBadge(email.status);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <tr key={email.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">
                            {email.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 max-w-xs truncate">
                          {email.message}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500">
                          {email.sentAt}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusInfo.class}`}
                        >
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusInfo.text}
                        </span>
                        {email.openedAt && (
                          <p className="text-xs text-gray-400 mt-1">
                            Açılıb: {email.openedAt}
                          </p>
                        )}
                        {email.clickedAt && (
                          <p className="text-xs text-gray-400 mt-1">
                            Klik: {email.clickedAt}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          {email.status === "sent" && (
                            <button
                              onClick={() => simulateOpen(email.id)}
                              className="text-yellow-600 hover:text-yellow-700 text-xs px-2 py-1 border border-yellow-600 rounded hover:bg-yellow-50"
                              title="Açılma simulyasiyası"
                            >
                              Açıldı
                            </button>
                          )}
                          {(email.status === "sent" ||
                            email.status === "opened") && (
                              <button
                                onClick={() => simulateClick(email.id)}
                                className="text-red-600 hover:text-red-700 text-xs px-2 py-1 border border-red-600 rounded hover:bg-red-50"
                                title="Klik simulyasiyası"
                              >
                                Klik
                              </button>
                            )}
                          <button
                            onClick={() => handleDelete(email.id)}
                            className="text-gray-400 hover:text-red-600"
                            title="Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {emails.length === 0 && (
              <div className="text-center py-12">
                <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">
                  Hələ heç bir email göndərilməyib
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
