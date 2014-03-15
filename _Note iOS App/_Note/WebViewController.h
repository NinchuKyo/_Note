//
//  WebViewController.h
//  _Note
//
//  Created by David Nguyen on 3/15/2014.
//  Copyright (c) 2014 Lyndon Quigley. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface WebViewController : UIViewController

@property (strong, nonatomic) IBOutlet UIWebView *web;
@property NSURLConnection *urlConnection;
@property NSURLRequest *urlRequest;
@property BOOL authenticated;

@end
