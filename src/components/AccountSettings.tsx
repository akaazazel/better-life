import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface AccountSettingsProps {
    currentUser: string;
    onClose: () => void;
    onSave: (newName: string) => void;
}

export const AccountSettings = ({
    currentUser,
    onClose,
    onSave,
}: AccountSettingsProps) => {
    const [username, setUsername] = useState(currentUser);
    const [bio, setBio] = useState(localStorage.getItem("bio") || "");

    const handleSave = () => {
        localStorage.setItem("bio", bio);
        onSave(username);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    <X className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold mb-4">Account Settings</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Username
                        </label>
                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Bio
                        </label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            rows={3}
                        />
                    </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>Save</Button>
                </div>
            </div>
        </div>
    );
};
