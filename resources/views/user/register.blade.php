<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no">
    <title> Register </title>
    <link rel="icon" type="image/x-icon" href="{{asset('assets/img/favicon.ico')}}"/>
    <link href="{{asset('menu/css/light/loader.css')}}" rel="stylesheet" type="text/css"/>
    <link href="{{asset('menu/css/dark/loader.css')}}" rel="stylesheet" type="text/css"/>
    <script src="{{asset('menu/loader.js')}}"></script>
    <!-- BEGIN GLOBAL MANDATORY STYLES -->
    <link href="https://fonts.googleapis.com/css?family=Nunito:400,600,700" rel="stylesheet">
    <link href="{{asset('bootstrap/css/bootstrap.min.css')}}" rel="stylesheet" type="text/css"/>

    <link href="{{asset('menu/css/light/plugins.css')}}" rel="stylesheet" type="text/css"/>
    <link href="{{asset('assets/css/light/authentication/auth-cover.css')}}" rel="stylesheet" type="text/css"/>

    <link href="{{asset('menu/css/dark/plugins.css')}}" rel="stylesheet" type="text/css"/>
    <link href="{{asset('assets/css/dark/authentication/auth-cover.css')}}" rel="stylesheet" type="text/css"/>
    <!-- END GLOBAL MANDATORY STYLES -->

</head>
<body class="form">

<!-- BEGIN LOADER -->
<div id="load_screen">
    <div class="loader">
        <div class="loader-content">
            <div class="spinner-grow align-self-center"></div>
        </div>
    </div>
</div>
<!--  END LOADER -->

<div class="auth-container d-flex">

    <div class="container mx-auto align-self-center">

        <div class="row">

            <div
                class="col-6 d-lg-flex d-none h-100 my-auto top-0 start-0 text-center justify-content-center flex-column">
                <div class="auth-cover-bg-image"></div>
                <div class="auth-overlay"></div>

                <div class="auth-cover">

                    <div class="position-relative">

                        <img src="{{asset('assets/img/auth-cover.svg')}}" alt="auth-img">

                        <h2 class="mt-5 text-white font-weight-bolder px-2">Join the community of expert developers</h2>
                        <p class="text-white px-2">It is easy to setup with great customer experience. Start your 7-day
                            free trial</p>
                    </div>

                </div>

            </div>

            <div
                class="col-xxl-4 col-xl-5 col-lg-5 col-md-8 col-12 d-flex flex-column align-self-center ms-lg-auto me-lg-0 mx-auto">
                <div class="card">
                    <div class="card-body">

                        <div class="row">
                            <div class="col-md-12 mb-3">

                                <h2>Register</h2>
                                <p>Enter your email and password to register</p>

                            </div>
                            <form action="{{ route('register') }}" method="post">
                                @csrf

                                <div class="col-md-12 mb-3">
                                    <label class="form-label">Email</label>
                                    <input name="email" type="email" class="form-control" value="{{ old('email') }}">
                                </div>

                                <div class="col-12 mb-3">
                                    <label class="form-label">Password</label>
                                    <input name="password" type="password" class="form-control">
                                </div>

                                <div class="col-12 mb-3">
                                    <label class="form-label">Confirm Password</label>
                                    <input name="password_confirmation" type="password" class="form-control">
                                </div>

                                <div class="col-12">
                                    <button type="submit" class="btn btn-secondary w-100">Register</button>
                                </div>

                                @if ($errors->any())
                                    <div class="alert alert-danger mt-3">
                                        <ul class="mb-0">
                                            @foreach ($errors->all() as $error)
                                                <li>{{ $error }}</li>
                                            @endforeach
                                        </ul>
                                    </div>
                                @endif
                            </form>

                            <div class="col-12 mt-4">
                                <div class="text-center">
                                    <p class="mb-0">Do you have an account ? <a href="{{route('login')}}"
                                                                                class="text-warning">Sign Up</a></p>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>

        </div>

    </div>

</div>

<!-- BEGIN GLOBAL MANDATORY SCRIPTS -->
<script src="{{asset('bootstrap/js/bootstrap.bundle.min.js')}}"></script>
<!-- END GLOBAL MANDATORY SCRIPTS -->


</body>
</html>
