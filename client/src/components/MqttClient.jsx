// src/components/MqttClient.jsx

import React, { useEffect } from 'react';
import mqtt from 'mqtt';

function MqttClient() {
  useEffect(() => {
    const client = mqtt.connect('wss://test.mosquitto.org:8081');

    client.on('connect', () => {
      console.log('✅ Connected to MQTT broker');
      client.subscribe('smartbus/ghaziabad');
    });

    client.on('message', (topic, message) => {
      console.log(`📩 Message on ${topic}:`, message.toString());
      // You can update state or trigger UI changes here
    });

    return () => {
      client.end();
    };
  }, []);

  return <div>MQTT Client Active</div>;
}

export default MqttClient;