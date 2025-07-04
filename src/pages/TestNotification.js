import React, { useState, useEffect } from 'react';
import axios from '../axios';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../firebase'; // Adjust the import path if needed

function TestNotification() {
    const [token, setToken] = useState('');

    useEffect(() => {
        // ✅ Fetch FCM token using your Firebase project and VAPID key
        getToken(messaging, {
            vapidKey: 'BPF7zDg3hUKF1wbgnkCI72xjYnNd8_5NHzE3OykFf3aaG7Y3rHu4YxtkyMUxVGtQg2r04yG24JtfpwCIiPLAqTQ',
        })
            .then((currentToken) => {
                if (currentToken) {
                    console.log('✅ FCM Token:', currentToken);
                    setToken(currentToken);
                    localStorage.setItem('fcm_token', currentToken);

                    // ✅ Save token to backend
                   axios.post('/save-token', { token: currentToken })      // ✅ correct
                        .then(() => console.log('📥 Token saved to backend'))
                        .catch(err => console.error('❌ Failed to save token', err));
                } else {
                    console.warn('🔕 No FCM token available. Permission might be blocked.');
                }
            })
            .catch((err) => console.error('❌ FCM token fetch error:', err));

        // ✅ Listen for incoming foreground messages
        onMessage(messaging, (payload) => {
            console.log('📩 Foreground message received:', payload);
            alert(`📣 ${payload.notification.title}\n\n${payload.notification.body}`);
        });
    }, []);

    const handleSend = async () => {
        if (!token.trim()) {
            alert('⚠️ No FCM token available to send');
            return;
        }

        try {
            const res = await axios.post('/test-fcm', {
                token,
                title: '🚀 UniHub Test Notification',
                body: '📢 This is a test push notification from UniHub!',
            });

            console.log('✅ Notification Sent:', res.data);
            alert('✅ Notification sent!');
        } catch (err) {
            console.error('❌ Notification error:', err);
            alert('❌ Failed to send push notification');
        }
    };

    return (
        <div className="text-center mt-5">
            <h4 className="mb-4">🔔 UniHub Test Push Notification</h4>
            <div className="d-flex justify-content-center align-items-center gap-2 px-3">
                <input
                    type="text"
                    value={token}
                    placeholder="Your FCM Token will appear here"
                    onChange={(e) => setToken(e.target.value)}
                    className="form-control"
                    style={{ maxWidth: '500px' }}
                />
                <button className="btn btn-success" onClick={handleSend}>
                    Send Notification
                </button>
            </div>
        </div>
    );
}

export default TestNotification;
