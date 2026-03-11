const fs = require('fs');
const csv = require('csv-parser');
const prisma = require('../utils/prisma');
const { employeeSchema } = require('../utils/validators');

const bulkUploadEmployees = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const results = [];
  const errors = [];
  let totalRows = 0;
  let successCount = 0;
  let failedCount = 0;

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => {
      totalRows++;
      results.push(data);
    })
    .on('end', async () => {
      const processedResults = [];

      // Get all departments for mapping names to IDs
      const departments = await prisma.department.findMany();
      const deptMap = {};
      departments.forEach(d => deptMap[d.name.toLowerCase()] = d.id);

      for (let i = 0; i < results.length; i++) {
        const row = results[i];
        try {
          // Map team or department name to ID
          const teamName = row.team || row.department;
          const deptId = deptMap[teamName?.toLowerCase()];
          if (!deptId) throw new Error(`Team "${teamName}" not found`);

          // Map "id" or "doj" if provided in CSV with those headers
          const mapping = {
            ...row,
            departmentId: deptId,
            employeeCode: row.id || row.employeeCode,
            dateOfJoining: new Date(row.doj || row.dateOfJoining)
          };

          // Check for duplicates in DB
          const existing = await prisma.employee.findFirst({
            where: {
              OR: [
                { email: validatedData.email },
                { employeeCode: validatedData.employeeCode }
              ]
            }
          });

          if (existing) {
            throw new Error(`Duplicate email or employee code: ${validatedData.email} / ${validatedData.employeeCode}`);
          }

          // Validate and prepare row
          const validatedData = employeeSchema.parse(mapping);
          processedResults.push({
            ...validatedData,
            dateOfJoining: new Date(validatedData.dateOfJoining)
          });
          successCount++;
        } catch (error) {
          failedCount++;
          errors.push({
            row: i + 2, // +1 for header, +1 for indexing
            error: error.message || 'Validation failed',
            data: row
          });
        }
      }

      // Save valid records
      if (processedResults.length > 0) {
        await prisma.employee.createMany({
          data: processedResults,
          skipDuplicates: true
        });
      }

      // Create Upload Log
      const uploadLog = await prisma.uploadLog.create({
        data: {
          fileName: req.file.originalname,
          status: failedCount === 0 ? 'SUCCESS' : 'PARTIAL_SUCCESS',
          totalRows,
          successCount,
          failedCount,
          errorReport: { errors }
        }
      });

      // Audit Log
      await prisma.auditLog.create({
        data: {
          userId: req.user.id,
          action: 'BULK_UPLOAD',
          entity: 'EMPLOYEE',
          entityId: uploadLog.id,
          details: { successCount, failedCount, totalRows }
        }
      });

      // Cleanup file
      fs.unlinkSync(req.file.path);

      res.json({
        message: 'Upload processed',
        summary: {
          totalRows,
          successCount,
          failedCount,
        },
        errors: errors.slice(0, 100) // Limit error feedback in response
      });
    })
    .on('error', (err) => {
      res.status(500).json({ message: 'Error parsing CSV' });
    });
};

const bulkUploadJson = async (req, res) => {
  try {
    const { employees, fileName } = req.body;
    
    if (!employees || !Array.isArray(employees)) {
      return res.status(400).json({ message: 'Invalid payload: employees array required' });
    }

    const results = employees;
    const errors = [];
    let totalRows = results.length;
    let successCount = 0;
    let failedCount = 0;
    let duplicatesSkipped = 0;

    const processedResults = [];

    // Get all departments for mapping names to IDs
    const departments = await prisma.department.findMany();
    const deptMap = {};
    departments.forEach(d => deptMap[d.name.toLowerCase()] = d.id);

    // Fetch existing emails and codes to prevent duplicate checks efficiently
    const existingEmployees = await prisma.employee.findMany();
    const existingEmails = new Set(existingEmployees.map(e => e.email.toLowerCase()));
    const existingCodes = new Set(existingEmployees.map(e => e.employeeCode.toLowerCase()));

    for (let i = 0; i < results.length; i++) {
      const row = results[i];
      try {
        // Map team or department name to ID, auto-create if missing
        let teamName = row.team || row.department;
        if (!teamName || String(teamName).trim() === '') {
          teamName = 'Unassigned';
        }
        teamName = String(teamName).trim();
        
        let deptId = deptMap[teamName.toLowerCase()];
        
        if (!deptId) {
          // Auto-create missing department
          const newDept = await prisma.department.create({
            data: { name: teamName.toUpperCase() }
          });
          deptId = newDept.id;
          deptMap[teamName.toLowerCase()] = deptId;
        }

        // Generate fallbacks for strictly required unique fields if completely missing
        const fallbackCode = `EMP-${Date.now()}-${i}`;
        const fallbackEmail = `employee${Date.now()}${i}@hrms.com`;
        
        const rawCode = String(row.employeeCode || fallbackCode).trim();
        const rawEmail = String(row.email || fallbackEmail).trim();
        
        const email = rawEmail.toLowerCase();
        const code = rawCode.toLowerCase();

        if (existingEmails.has(email) || existingCodes.has(code)) {
          duplicatesSkipped++;
          // Skip the rest of the logic for duplicates without treating it as validation failure
          continue;
        }

        // Normalize employmentType to match DB enums ('FULL_TIME' | 'INTERN')
        let empTypeRaw = row.employmentType || row['Type of Employment'] || 'FULL_TIME';
        empTypeRaw = String(empTypeRaw).toUpperCase().replace('-', '_').replace(' ', '_');
        if (!['FULL_TIME', 'INTERN'].includes(empTypeRaw)) {
          empTypeRaw = 'FULL_TIME'; // Fallback
        }

        // Ensure date is valid, fallback to today
        let parsedDate = new Date(row.dateOfJoining);
        if (isNaN(parsedDate.getTime())) {
          parsedDate = new Date();
        }

        const mapping = {
          ...row,
          fullName: row.fullName || 'Unknown Employee',
          role: row.role || 'Employee',
          phoneNumber: String(row.phoneNumber || '0000000000').padStart(10, '0'),
          employeeCode: rawCode,
          email: rawEmail,
          employmentType: empTypeRaw,
          departmentId: deptId,
          dateOfJoining: parsedDate
        };

        // Validate and prepare row
        const validatedData = employeeSchema.parse(mapping);
        processedResults.push({
          ...validatedData,
          dateOfJoining: new Date(validatedData.dateOfJoining)
        });
        successCount++;
        
        // Temporarily add to Set for current batch to prevent duplicates inside the batch itself
        existingEmails.add(email);
        existingCodes.add(code);
      } catch (error) {
        let msg = error.message || 'Validation failed';
        if (error.errors && Array.isArray(error.errors)) {
          msg = error.errors.map(e => `${e.path.join('.') || 'Field'}: ${e.message}`).join(', ');
        }
        failedCount++;
        errors.push({
          row: i + 2, // Assuming 1 header row
          error: msg,
          data: row
        });
      }
    }

    // Save valid records
    if (processedResults.length > 0) {
      await prisma.employee.createMany({
        data: processedResults,
        skipDuplicates: true
      });
    }

    // Create Upload Log
    const uploadLog = await prisma.uploadLog.create({
      data: {
        fileName: fileName || 'bulk_upload.json',
        status: failedCount === 0 ? 'SUCCESS' : 'PARTIAL_SUCCESS',
        totalRows,
        successCount,
        failedCount,
        errorReport: { errors, duplicatesSkipped }
      }
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'BULK_UPLOAD',
        entity: 'EMPLOYEE',
        entityId: uploadLog.id,
        details: { successCount, failedCount, duplicatesSkipped, totalRows }
      }
    });

    res.json({
      message: 'Upload processed',
      summary: {
        totalRows,
        successCount,
        failedCount,
        duplicatesSkipped
      },
      errors: errors.slice(0, 100) // Limit error feedback in response
    });
  } catch (err) {
    res.status(500).json({ message: 'Error processing bulk upload', error: err.message });
  }
};

const getUploadLogs = async (req, res) => {
  try {
    const logs = await prisma.uploadLog.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const downloadTemplate = (req, res) => {
  const xlsx = require('xlsx');
  
  // Create workbook
  const wb = xlsx.utils.book_new();
  
  // Data array
  const ws_data = [
    ["Emp No.", "Name", "Role", "Type of Employment", "DOJ", "Team", "Contact Num", "Email"],
    ["EMP001", "John Doe", "Developer", "FULL_TIME", "2023-01-01", "Engineering", "1234567890", "john@example.com"],
    ["EMP002", "Jane Smith", "Designer", "FULL_TIME", "2023-02-15", "Design", "0987654321", "jane@example.com"]
  ];
  
  const ws = xlsx.utils.aoa_to_sheet(ws_data);
  xlsx.utils.book_append_sheet(wb, ws, "Employees");
  
  // Generate file buffer
  const buf = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });
  
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=employee_template.xlsx');
  res.status(200).send(buf);
};

module.exports = { bulkUploadEmployees, bulkUploadJson, getUploadLogs, downloadTemplate };
