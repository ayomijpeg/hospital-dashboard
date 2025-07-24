ALTER TABLE `bill` ADD COLUMN `patientName` VARCHAR(191) NULL; 
UPDATE `bill` b 
LEFT JOIN `appointment` a ON b.appointmentId = a.id 
LEFT JOIN `patient` p ON b.patientId = p.id 
SET b.patientName = 
  CASE 
    WHEN p.name IS NOT NULL THEN p.name 
    WHEN a.name IS NOT NULL THEN a.name 
    ELSE 'Unknown Patient' 
  END; 
