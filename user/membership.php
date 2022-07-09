<section class="user-manage-profile">
    <div class="container">
        <div class="row">
            <?php include_once './user/sidebar.php'; ?>
            <div class="col-md-9">
                <div class="manage-user-icon">
                    <div class="col-md-12">
                        <div class="row">
                            <div class="col-md-12">
                                <h3 class="h3-heading">Membership</h3>

                                <div class="row" id="membershipCards">
                                </div>

                                <h2 class="h2-heading">Card Statement</h2>
                                <div class="table-responsive">
                                    <table class="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>S.No.</th>
                                                <th>Order Number</th>
                                                <th>Amount Paid</th>
                                                <th>Final Amount</th>
                                                <th>Transaction At</th>
                                                <th>Salon</th>
                                            </tr>
                                        </thead>
                                        <tbody id="tbody_trans">
                                            <tr>
                                                <td colspan="6">Click on card to check transactions.</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div class="empty-box no-data-box">
                                    <h5>Get upto 50% off on Services, Attractive Deals & No Payment Hassles <br>
                                    Buy Our Membership Cards</h5>
                                    <img src="<?php echo $base_url; ?>assets/images/no-cards.png" alt="">
                                    <a href="/" class="btn btn-pink">Buy Membership Card</a>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<script type="text/javascript" src="assets/js/popper.min.js"></script>
<script type="text/javascript" src="assets/js/bootstrap.min.js"></script>
<script type="text/javascript" src="assets/js/popper.min.js"></script>
<script type="text/javascript" src="assets/js/fontAwesome.js"></script>