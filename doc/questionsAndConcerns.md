List Questions And Concerns about MasrsAir

During explore requirements, I have some concerns which might impact to testing result. I don't want to make assumption but would like to clarify before execution. Could you please take a look and give confirmation?

1. What is expected result if user does not select Departing and Returning (keep them as "Select...") but clicking Search? ( disabled Search button?/ error message appears on this form to request input value one user clicks Search?). Currently, system allows to search and show "No more seats available" is not make sense.
2. Do we allow for one-way flight? Mean that user search with Departing but without Returning? If not, what is the expected result?
3. The spec said "Trips for the next two years should be searchable", how about exeed 2 years behavior? Is this a valid combination? Or system should prevent and show error ( combine: Departing: July and Returning: December (two years from now)
4. When user inputs the valid promo code but the search returns that no seat is available, currently, discount message is not displayed. Is this expected or bug?
5. When user input valid promo code, but does not select Departing/Returning ( keep them as "Select..."), which one is validated first: promo code or available seat?
6. Spec said "Seats available! Call 0800 MARSAIR to book!" but UI shows 2 lines for it. Is this a UI bug?