const axios = require('axios');

const { BookingRepository } = require('../repositories')
const db = require('../models');
const { serverConfig, Queue} = require('../config');
const { Enums } = require('../utils/common');
const AppError = require('../utils/errors/app_error.js');
const { StatusCodes } = require('http-status-codes');

const { BOOKED } = Enums.BOOKING_STATUS;

const bookingRepository = new BookingRepository();

async function createBooking(data){
    const transaction = await db.sequelize.transaction();

    try {
        const flight = await axios.get(`${serverConfig.FLIGHT_SERVICE}/api/v1/flight/${data.flightId}`);
        const flightData = flight.data.data;

        if (!flightData) {
            throw new AppError('Flight not found', StatusCodes.NOT_FOUND);
        }

        if(data.noOfSeats > flightData.totalSeats){
            throw new AppError('Not enough seats available', StatusCodes.BAD_REQUEST);
        }

        const booking = await bookingRepository.create({
            flightId: data.flightId,
            userId: data.userId,
            noOfSeats: data.noOfSeats,
            totalCost: data.noOfSeats * flightData.price
        }, { transaction });

        await axios.patch(`${serverConfig.FLIGHT_SERVICE}/api/v1/flight/${data.flightId}/seats`, {
            seats: data.noOfSeats,
        });

        await booking.update({ status: BOOKED }, { transaction });
        await transaction.commit();
        Queue.sendData({
            recipientEmail: 'shubham88881sharma@gmail.com',
            subject: 'Flight booked',
            text: `Booking succesfully done on flight ${data.bookingId}`,

        })
        return booking;
    } catch (error) {
        await transaction.rollback();

        if (error instanceof AppError) {
            throw error;
        }

        if (error.response) {
            throw new AppError(
                error.response.data?.message || 'Unable to complete booking with flight service',
                error.response.status || StatusCodes.INTERNAL_SERVER_ERROR
            );
        }

        throw new AppError('Unable to create booking', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}





module.exports = {
    createBooking
}
