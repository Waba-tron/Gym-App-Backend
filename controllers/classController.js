const Class = require("../models/ClassModel");
const getClassById = async (req, res) => {
  try {
    const { id } = req.params;

    const exerciseClass = await Class.findById(id);

    res.status(200).json(exerciseClass);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getClassesWideSearch = async (req, res) => {
  try {
    const { date } = req.body;

    const d = new Date(date);
    d.setTime(d.getTime() - new Date().getTimezoneOffset() * 60 * 1000);

    const today = new Date(date);
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    console.log(tomorrow);
    const exerciseClasses = await Class.find({
      $and: [{ startTime: { $gte: d } }, { startTime: { $lte: tomorrow } }],
    });

    // console.log(exerciseClasses[0].startTime < d);

    //res.status(200).json(`${date}, ${exerciseClasses[0].startTime}`);

    // console.log(new Date(exerciseClasses[0].startTime), new Date(date));

    // const d = new Date(`${exerciseClasses[0].startTime}`);

    // res.json(`${d}`);
    /*
    const { type } = req.body;
  
    if (!type) {
      const exerciseClass = await Class.find();
      res.status(200).json(exerciseClass);
    }
    */

    res.status(200).json(exerciseClasses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const addClass = async (req, res) => {
  try {
    const {
      name,
      caption,
      description,
      exercises,
      trainer,
      startTime,
      duration,
      type,
      benefits,
      membershiptype,
    } = req.body;

    const exerciseClass = new Class({
      name,
      caption,
      description,
      exercises,
      trainer,
      startTime,
      duration,
      type,
      benefits,
      membershiptype,
    });

    await exerciseClass.save();

    res.status(200).json(exerciseClass);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getClassesWideSearch, getClassById, addClass };
