import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import {
    Mail,
    Phone,
    MapPin,
    Calendar
} from 'lucide-react';

interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    role: string;
    department: string;
    joinDate: Date;
    avatar: string;
    bio: string;
}

const mockProfile: UserProfile = {
    id: "1",
    name: "John Smith",
    email: "john.smith@arreglio.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, New York, NY 10001",
    role: "Administrator",
    department: "IT",
    joinDate: new Date('2023-01-15'),
    avatar: "/images/avatar/user1.jpg",
    bio: "Experienced administrator with 5+ years in system management and user support."
};

const Profile: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile>(mockProfile);
    const [isEditing, setIsEditing] = useState(false);
    const [toast, setToast] = useState<any>(null);

    const handleSave = () => {
        setIsEditing(false);
        setToast({
            severity: 'success',
            summary: 'Profile Updated',
            detail: 'Your profile has been updated successfully.',
            life: 3000
        });
    };

    const handleCancel = () => {
        setIsEditing(false);
        setProfile(mockProfile); // Reset to original data
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
                        <p className="text-gray-600">Manage your personal information and preferences</p>
                    </div>
                    <div className="flex gap-2">
                        {isEditing ? (
                            <>
                                <Button
                                    label="Save"
                                    icon="pi pi-check"
                                    onClick={handleSave}
                                    className="p-button-success"
                                />
                                <Button
                                    label="Cancel"
                                    icon="pi pi-times"
                                    onClick={handleCancel}
                                    className="p-button-text"
                                />
                            </>
                        ) : (
                            <Button
                                label="Edit Profile"
                                icon="pi pi-pencil"
                                onClick={() => setIsEditing(true)}
                            />
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <Card className="text-center">
                        <div className="space-y-4">
                            <div className="relative inline-block">
                                <img
                                    src={profile.avatar}
                                    alt="Profile Avatar"
                                    className="w-32 h-32 rounded-full mx-auto border-4 border-gray-200"
                                />
                                {isEditing && (
                                    <Button
                                        icon="pi pi-camera"
                                        className="p-button-rounded p-button-sm absolute bottom-0 right-0"
                                        onClick={() => {
                                            // Handle avatar upload
                                            setToast({
                                                severity: 'info',
                                                summary: 'Avatar Upload',
                                                detail: 'Avatar upload functionality would be implemented here.',
                                                life: 3000
                                            });
                                        }}
                                    />
                                )}
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                                <p className="text-gray-600">{profile.role}</p>
                                <p className="text-sm text-gray-500">{profile.department}</p>
                            </div>

                            <div className="text-left space-y-2">
                                <div className="flex items-center text-sm text-gray-600">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    <span>Joined {profile.joinDate.toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <Mail className="w-4 h-4 mr-2" />
                                    <span>{profile.email}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <Phone className="w-4 h-4 mr-2" />
                                    <span>{profile.phone}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    <span>{profile.address}</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Profile Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Personal Information */}
                    <Card header="Personal Information">
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    <InputText
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <InputText
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                    <InputText
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                    <InputText
                                        value={profile.address}
                                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                                <textarea
                                    value={profile.bio}
                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                    disabled={!isEditing}
                                    rows={4}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Account Information */}
                    <Card header="Account Information">
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                                    <InputText
                                        value={profile.role}
                                        disabled
                                        className="w-full bg-gray-100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                                    <InputText
                                        value={profile.department}
                                        disabled
                                        className="w-full bg-gray-100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
                                    <InputText
                                        value={profile.id}
                                        disabled
                                        className="w-full bg-gray-100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Join Date</label>
                                    <InputText
                                        value={profile.joinDate.toLocaleDateString()}
                                        disabled
                                        className="w-full bg-gray-100"
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Security Settings */}
                    <Card header="Security Settings">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                <div>
                                    <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                                    <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                                </div>
                                <Button
                                    label="Enable"
                                    className="p-button-outlined"
                                    onClick={() => {
                                        setToast({
                                            severity: 'info',
                                            summary: '2FA Setup',
                                            detail: 'Two-factor authentication setup would be implemented here.',
                                            life: 3000
                                        });
                                    }}
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                <div>
                                    <h4 className="font-medium text-gray-900">Change Password</h4>
                                    <p className="text-sm text-gray-600">Update your password regularly for security</p>
                                </div>
                                <Button
                                    label="Change"
                                    className="p-button-outlined"
                                    onClick={() => {
                                        setToast({
                                            severity: 'info',
                                            summary: 'Password Change',
                                            detail: 'Password change functionality would be implemented here.',
                                            life: 3000
                                        });
                                    }}
                                />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <Toast ref={toast} />
        </div>
    );
};

export default Profile; 