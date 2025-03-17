const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FamilyMember',
        required: true
    },
    recordType: {
        type: String,
        required: true,
        enum: ['Lab Report', 'Prescription', 'Vaccination', 'Surgery', 'General Checkup', 'Other']
    },
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String
    },
    diagnosis: {
        type: String
    },
    medications: [{
        name: String,
        dosage: String,
        frequency: String,
        duration: String
    }],
    doctorInfo: {
        name: String,
        specialization: String,
        hospital: String
    },
    vitals: {
        bloodPressure: String,
        temperature: String,
        heartRate: String,
        oxygenLevel: String
    },
    followUp: {
        required: Boolean,
        date: Date,
        notes: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema); 