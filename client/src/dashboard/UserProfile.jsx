import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import LoaderComponent from '../components/ui/LoaderComponent';

const UserProfile = () => {
    const { id } = useParams();
    const { getUserProfile, user, loading, error } = useUser();

    useEffect(() => {
        // Get user ID from params or from localStorage if viewing own profile
        const userId = id || (JSON.parse(localStorage.getItem('user'))?.id);
        if (userId) {
            getUserProfile(userId);
        }
    }, [id, getUserProfile]);

    if (loading) return (
        <LoaderComponent isLoading={loading} />
    );

    if (error) return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
        </div>
    );

    if (!user) return (
        <div className="text-center py-8">
            <p className="text-gray-600">No user data available</p>
        </div>
    );

    return (
        <section className="md:max-w-4xl mx-auto pt-2 md:p-6 overflow-y-auto">
            <h2 className="md:text-center text-gray-800 uppercase font-condensed mb-4">
                User Profile
            </h2>

            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex flex-col md:flex-row items-center md:items-start">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-6">
                        {user.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.fullName}
                                className="w-24 h-24 rounded-full object-cover"
                            />
                        ) : (
                            <span className="text-3xl text-gray-400">
                                {user.fullName?.charAt(0).toUpperCase() || 'U'}
                            </span>
                        )}
                    </div>

                    <div className="flex-1">
                        <h3 className="text-2xl font-semibold mb-2">{user.fullName}</h3>
                        <p className="text-gray-600 mb-2">{user.email}</p>
                        <p className="text-sm uppercase text-gray-500 mb-4">Role: {user.role}</p>

                        <div className="mt-4">
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-3"
                            >
                                Edit Profile
                            </button>
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>

                {user.inventory && user.inventory.length > 0 && (
                    <div className="mt-8">
                        <h4 className="text-lg font-semibold mb-3">Inventory Items</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {user.inventory.map(item => (
                                <div key={item._id} className="border rounded p-3">
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {user.notifications && user.notifications.length > 0 && (
                    <div className="mt-8">
                        <h4 className="text-lg font-semibold mb-3">Notifications</h4>
                        <div className="space-y-3">
                            {user.notifications.map(notification => (
                                <div key={notification._id} className="bg-gray-50 p-3 rounded">
                                    <p className="font-medium">{notification.title}</p>
                                    <p className="text-sm">{notification.message}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default UserProfile;
