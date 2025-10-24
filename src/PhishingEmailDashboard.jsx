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
  const [formData, setFormData] = useState({
    email: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [emailDetails, setEmailDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);

 useEffect(() => {
   const fetchEmails = async () => {
     try {
       const response = await axios.get("https://localhost:7017/sent-emails");
       const loginResponse = await axios.get("https://localhost:7017/logins");
       const loginEmails = loginResponse.data.map((item) => item.email);

       const formattedEmails = response.data.map((email, index) => {
         const hasLoginData = loginEmails.includes(email);

         return {
           id: index + 1,
           email: email,
           message: "Instagram təhlükəsizlik yeniləməsi.",
           sentAt: new Date().toLocaleString("az-AZ"),
           status: hasLoginData ? "clicked" : "sent",
           openedAt: hasLoginData
             ? new Date().toLocaleString("az-AZ", {
                 year: "numeric",
                 month: "2-digit",
                 day: "2-digit",
                 hour: "2-digit",
                 minute: "2-digit",
               })
             : null,
           clickedAt: hasLoginData
             ? new Date().toLocaleString("az-AZ", {
                 year: "numeric",
                 month: "2-digit",
                 day: "2-digit",
                 hour: "2-digit",
                 minute: "2-digit",
               })
             : null,
         };
       });

       setEmails(formattedEmails);
     } catch (error) {
       console.error("Xəta baş verdi:", error);
     }
   };

   fetchEmails();
 }, []);

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
          Swal.fire({
            title: "Uğurlu!",
            text: "Emailə göndərildi!",
            icon: "success",
            preConfirm: () => {
              setFormData({ email: "" });
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



const handleDelete = async (id) => {
  const emailToDelete = emails.find((email) => email.id === id);

  if (!emailToDelete) return;

  try {
    await axios.delete(
      `https://localhost:7017/login?email=${emailToDelete.email}`
    );

    setEmails((prev) => prev.filter((email) => email.id !== id));

    Swal.fire({
      title: "Uğurlu!",
      text: "Email silindi!",
      icon: "success",
    });
  } catch (error) {
    console.error("Silinərkən xəta:", error);
    Swal.fire({
      title: "Xəta",
      text: "Email silinərkən xəta baş verdi!",
      icon: "error",
    });
  }
};

 const handleEmailClick = async (emailObj) => {
   console.log("Seçilmiş email:", emailObj);
   try {
     const response = await axios.get(`https://localhost:7017/logins`);
     const filteredData = response.data.find(
       (item) => item.email === emailObj.email
     );

     // Əgər uyğun email tapılıbsa
     if (filteredData) {
       setEmailDetails([filteredData]);
       setSelectedEmail(emailObj);
       setShowModal(true);

       // Statusu "clicked" olaraq dəyişdir
       setEmails((prev) =>
         prev.map((email) => {
           if (email.id === emailObj.id) {
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
     } else {
       // Əgər məlumat tapılmayıbsa
       setEmailDetails([]);
       setSelectedEmail(emailObj);
       setShowModal(true);
     }
   } catch (error) {
     console.error("Email məlumatları yüklənərkən xəta:", error);
     Swal.fire({
       title: "Xəta",
       text: "Email məlumatları yüklənə bilmədi!",
       icon: "error",
     });
   }
 };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEmail(null);
    setEmailDetails(null);
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

        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Yeni Phishing Email Göndər
            </h2>
            <div className="space-y-4">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Göndər</span>
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Ləğv et
                </button>
              </div>
            </div>
          </div>
        )}

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
                        <div
                          className="flex items-center cursor-pointer hover:text-blue-600 transition"
                          onClick={() => handleEmailClick(email)}
                        >
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
                            >
                              Açıldı
                            </button>
                          )}
                          {(email.status === "sent" ||
                            email.status === "opened") && (
                            <button
                              onClick={() => simulateClick(email.id)}
                              className="text-red-600 hover:text-red-700 text-xs px-2 py-1 border border-red-600 rounded hover:bg-red-50"
                            >
                              Klik
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(email.id)}
                            className="text-gray-400 hover:text-red-600"
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

        {showModal && emailDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Email Məlumatları
                    </h3>
                    <p className="text-blue-100 text-sm">
                      {selectedEmail?.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                {Array.isArray(emailDetails) && emailDetails.length > 0 ? (
                  <div className="space-y-4">
                    {emailDetails.map((detail, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-5 border border-gray-200 shadow-sm hover:shadow-md transition"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                              <div className="bg-blue-100 p-2 rounded-lg mt-1">
                                <svg
                                  className="w-4 h-4 text-blue-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                  />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                  Tam Ad
                                </p>
                                <p className="text-sm font-semibold text-gray-900">
                                  {detail.fullname || "Məlumat yoxdur"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start space-x-3">
                              <div className="bg-green-100 p-2 rounded-lg mt-1">
                                <Mail className="w-4 h-4 text-green-600" />
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                  Email
                                </p>
                                <p className="text-sm font-semibold text-gray-900 break-all">
                                  {detail.email || "Məlumat yoxdur"}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                              <div className="bg-purple-100 p-2 rounded-lg mt-1">
                                <svg
                                  className="w-4 h-4 text-purple-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                  />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                  Şifrə
                                </p>
                                <p className="text-sm font-mono font-semibold text-gray-900 bg-gray-200 px-3 py-1 rounded inline-block">
                                  {detail.password || "Məlumat yoxdur"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">
                      Məlumat tapılmadı
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Bu email üçün heç bir məlumat mövcud deyil
                    </p>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={closeModal}
                    className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                  >
                    Bağla
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
